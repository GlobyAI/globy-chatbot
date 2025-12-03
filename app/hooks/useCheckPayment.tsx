import { useAuth0, User } from '@auth0/auth0-react';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '~/utils/vars';


export default function useCheckPayment() {
    const { user, isAuthenticated, isLoading } = useAuth0()
    const navigate = useNavigate()

    const hasPaid = (user: User | undefined) => {
        if (
            user &&
            user["https://globy.ai/has_paid"] === true
        ) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            const currentPlan = user["https://globy.ai/plan"];
            // No plan selected  → invalid
            if (!currentPlan) {
                navigate(APP_ROUTES.PRICE);
                return
            }

            // Non-free plan but not paid → invalid
            if (currentPlan !== "FREE" && !hasPaid(user)) {
                navigate(APP_ROUTES.PRICE);
                return
            }
        }

    }, [user, isAuthenticated, isLoading])
}