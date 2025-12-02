import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Fragment, useCallback, useState } from "react";
import axiosInstance from "~/services/axiosInstance";
import { PaymentInterval } from "~/types/enums";
import { loadStripe, type Stripe as StripeJs, type StripeCheckoutSession } from '@stripe/stripe-js';
import { envConfig } from "~/utils/envConfig";

import { APP_ROUTES } from "~/utils/vars";
import type { Route } from "../../+types/root";


const DISCOUNT = 30
const plans = [
    {
        id: '1',
        name: 'Impact',
        productName: 'FREE',
        price: 0,
        description: 'Because first impressions should last.',
        benefits: [
            '10 Generations',
            'Hosted on a subdomain',
            'Advanced custom elements e.g. testimonials & pricing tables'
        ]
    },
    {
        id: '2',
        name: 'Spotlight',
        productName: 'SPOTLIGHT',
        price: 6,
        description: 'Make your brand unforgettable.',
        benefits: [
            '50 Generations',
            'Complete brand system',
            'Technical support',
            'Connect your custom domain'
        ]
    },
    {
        id: '3',
        name: 'Momentum',
        productName: 'MOMENTUM',
        price: 39,
        description: 'Ready to scale and make business.',
        benefits: [
            '500 Generations',
            'Priority technical support',
        ],
    },
    {
        id: '4',
        name: 'Signature',
        productName: '',
        price: -1,
        description: "Tailored solution for your brand, needs & growth.",
        benefits: [

        ]
    },

]
export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Globy.ai | Pricing", },
    ];
}
export default withAuthenticationRequired(function PricingTier() {

    const { user, loginWithRedirect } = useAuth0()
    const [selectedPlan, setSelectedPlan] = useState<PaymentInterval>(PaymentInterval.MONTH)
    const [error, setError] = useState(false)
    const handleChangePlan = (plan: PaymentInterval) => {
        setSelectedPlan(plan)
    }

    const calculatePriceWidthDiscount = useCallback(
        (month_price: number) => {
            if (selectedPlan === PaymentInterval.MONTH) return month_price
            return Number(month_price * 12 * ((100 - DISCOUNT) / 100)).toFixed(1)
        },
        [selectedPlan],
    )
    async function getCheckoutSession(payload: {
        customer_email: string,
        product_name: string,
        interval: PaymentInterval,
        success_url: string,
        cancel_url: string
    }) {

        return await axiosInstance<{
            session_id: string,
            stripe_session: StripeCheckoutSession
        }>(
            {
                url: envConfig.CHECKOUT_URL || '',
                method: 'POST',
                data: payload,
            }
        );
    }


    const goToCheckOutPage = async (product_name: string) => {
        if (!product_name) return
        const stripePromise: StripeJs | null = await loadStripe(envConfig.STRIPE_PUBLISHABLE_KEY!);
        if (!stripePromise) {
            console.error('Stripe.js is not loaded yet');
            setError(true)
            return;
        }
        if (user && stripePromise) {
            try {
                const sessionRes = await getCheckoutSession({
                    customer_email: user.email || '',
                    product_name: product_name,
                    interval: selectedPlan,
                    success_url: envConfig.APP_DOMAIN + '/success/' + product_name.toLowerCase(),
                    cancel_url: envConfig.APP_DOMAIN + APP_ROUTES.PRICE

                })
                if (sessionRes.status === 200) {
                    const session = sessionRes.data
                    const { error } = await stripePromise.redirectToCheckout({
                        sessionId: session.session_id,
                    });

                    if (error) {
                        console.error('Stripe redirect error:', error.message);
                        setError(true);
                    }
                }
            } catch (error) {
                console.log("Stripe checkout error " + error)
                setError(true)
            }
        }

    }


    return (
        <div className="price">
            <div className="price__container">
                <h2>
                    Pricing </h2>
                <div className="subscription">
                    <div className={`billing-circle ${selectedPlan}`}>
                        <p
                            className={`billing-circle__options ${selectedPlan === PaymentInterval.MONTH ? 'selected' : ''}  `}
                            onClick={() => handleChangePlan(PaymentInterval.MONTH)}
                        >
                            Monthly
                        </p>
                        <p
                            className={`billing-circle__options ${selectedPlan === PaymentInterval.YEAR ? 'selected' : ''}`}
                            onClick={() => handleChangePlan(PaymentInterval.YEAR)}
                        >
                            Annually
                        </p>
                    </div>
                    <p className="sub-title">Save {DISCOUNT}% with yearly billing</p>
                    {
                        error &&
                        <p className="error">
                            We could not process your request right now. <br />Contact our support <a href="mailto:support@globy.ai">support@globy.ai</a> if problem remains.
                        </p>
                    }

                    <div className="pricing-tiers" key={selectedPlan}>
                        {
                            plans.map((p, index) => (
                                <article key={p.id} className={`pricing-tiers__options `}>
                                    <div className="option-detail">
                                        <h2 className="option-detail__name">
                                            {p.name}
                                        </h2>
                                        <p className="option-detail__price">
                                            {
                                                p.price > 0 &&
                                                <Fragment>
                                                    &#36;
                                                    {
                                                        calculatePriceWidthDiscount(p.price)} /

                                                    <span>
                                                        {selectedPlan === PaymentInterval.YEAR ? 'year' : 'month'}
                                                    </span>
                                                </Fragment>
                                            }
                                            {
                                                p.price === 0 &&
                                                "Free"
                                            }
                                            {
                                                p.price === -1 &&
                                                "Custom"
                                            }
                                        </p>
                                        <p className="option-detail__description">
                                            {
                                                p.description
                                            }
                                        </p>
                                    </div>
                                    {
                                        p.price === 0 &&
                                        <button className="btn" type="button" onClick={() => {
                                            if (user && user['https://globy.ai/plan'] === '') {
                                                loginWithRedirect(
                                                    {
                                                        appState: {
                                                            returnTo: "/success/" + p.name.toLowerCase()
                                                        },
                                                        authorizationParams: {
                                                            selected_plan: "FREE",
                                                        },
                                                    }
                                                )
                                            }
                                        }
                                        }>Choose {p.name}</button>

                                    }
                                    {
                                        p.price > 0 &&
                                        <button className="btn" type="button" onClick={() => goToCheckOutPage(p.productName)}>Get 60-days free</button>

                                    }
                                    {
                                        p.price < 0 &&
                                        <a className="btn" href='mailto:hello@globy.ai'>
                                            Contact us
                                        </a>

                                    }


                                    <ul className="support-details">
                                        {
                                            p.price > 0 && p.benefits.length &&
                                            <li className="support-details__items" >
                                                {
                                                    index > 0 &&
                                                    <p className="content">
                                                        Everything in {plans[index - 1].name} and:
                                                    </p>
                                                }
                                            </li>
                                        }
                                        {p.benefits && p.benefits.map((f, idx) => (
                                            <li className="support-details__items" key={idx}>
                                                <p className="image">
                                                    <img src="/icons/ticket.svg" />
                                                </p>
                                                <p className="content">
                                                    {f}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>

                                </article>

                            ))
                        }
                    </div>

                </div>
            </div>
        </div >
    )
})