import { useState } from 'react'
import { useAppContext } from '~/providers/AppContextProvider'
import ArrowRightIcon from '/icons/arrow-right.svg'
import WarningIcon from '/icons/warning.svg'
import { completeWorkFlow } from '~/services/appApis'
import toast from 'react-hot-toast'
import Modal from '~/components/ui/Modal/Modal'
import { envConfig } from '~/utils/envConfig'
import type { AxiosError } from 'axios'


export default function Complete() {
    const [willComplete, setWillComplete] = useState(false)

    function handleToggleConfirm() {
        setWillComplete(prev => !prev)
    }
    return (
        <div className={`move-on `}>
            {
                <button onClick={handleToggleConfirm} >
                    <p>Continue</p>
                    <img src={ArrowRightIcon} alt="Arrow right" />
                </button>

            }
            <ContinueConfirm handleToggleConfirm={handleToggleConfirm} willComplete={willComplete} />
        </div>
    )
}


function ContinueConfirm({ handleToggleConfirm, willComplete }: { handleToggleConfirm: () => void, willComplete: boolean }) {
    const { userId } = useAppContext()
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    async function handComplete() {
        if (userId) {
            setIsLoading(true)
            try {
                const res = await completeWorkFlow(userId)
                setIsLoading(false)
                if (res.data.status.includes('completed')) {
                    setIsRedirecting(true)
                    setTimeout(() => {
                        window.location.href = envConfig.LANDING_PAGE + '/account'
                    }, 2000)
                } else {
                    toast.success("Status: ", res.data.status)
                }
            } catch (error) {
                setIsLoading(false)
                const axiosError = error as AxiosError<{ detail: string }>
                toast.error(axiosError.response?.data?.detail || 'An error occurred')

            }

        }
    }


    return (
        <Modal open={willComplete}>
            {
                isRedirecting || isLoading ? <div className='redirecting'>
                    <div className="loader"></div>
                    {
                        isRedirecting &&
                        <p>Redirecting</p>
                    }
                </div>
                    :
                    <div className="confirm">
                        <div className="confirm__icon">
                            <figure>
                                <img src={WarningIcon} alt="Warning Icon" />

                            </figure>
                        </div>
                        <div className="confirm__content">
                            <h6>Continue to the next step?</h6>
                            <p>You’re about to move on from the setup chat. Everything you’ve shared will be saved and your website setup will start building.</p>
                            <span>You’ll land in your dashboard — from there you can open the site editor anytime.</span>
                        </div>
                        <div className="confirm__btns">
                            <button className="btn btn--secondary" onClick={handleToggleConfirm}>Stay in chat</button>
                            <button className="btn btn--primary" onClick={handComplete}>Continue</button>
                        </div>
                    </div>
            }
        </ Modal>
    )
}