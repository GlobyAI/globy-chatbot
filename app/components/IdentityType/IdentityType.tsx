import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAppContext } from '~/providers/AppContextProvider';
import Modal from '../ui/Modal/Modal';
import { getIdentity, setIdentity } from '~/services/identityApis';
import { IdentityTypeEnum } from '~/types/enums';
import SpinnerLoading from '../ui/SpinnerLoading/SpinnerLoading';
import { AxiosError } from 'axios';
import useAppStore from '~/stores/appStore';
import UserIcon from '/icons/user.svg'
import BriefcaseIcon from '/icons/briefcase.svg'


export default function IdentityType({
  onContinue,
  hasIdentity
}: {
  onContinue: () => void
  hasIdentity: boolean
}) {
  const {
    userId,
  } = useAppContext();
  const setIsLoading = useAppStore(s=>s.setLoading)

  const [type, setType] = useState<IdentityTypeEnum | null>(null)
  const setIdentityType = async () => {
    if (!userId || !type) return
    try {
      const res = await setIdentity(userId, type)
      if (res?.status === 200) {
        onContinue()
      }
    } catch (error) {
      console.log('setIdentityType', error)
      if (error instanceof AxiosError) {

        toast.error(error.message);
      } else {
        toast.error("Unable to set identity. Try again later");
      }
    }
  }


  useEffect(() => {

    async function checkIdentity() {
      if (!userId) return
      try {
        const res = await getIdentity(userId)
        if (res.status === 200) {
          setIsLoading(false)
          onContinue()
        }

      } catch (error) {
        console.log('missing identity')
      }
    }
    if (!hasIdentity) {
      setIsLoading(true)
      checkIdentity()
      setIsLoading(false)
    }
  }, [hasIdentity, userId])
  const handleClick = async () => {
    if (type && userId) {
      setIsLoading(true)
      await setIdentityType()
      setIsLoading(false)
    }
  }

  const handleChangeType = (select: IdentityTypeEnum) => {
    setType(select)
  }

  return (
    <Modal open={!hasIdentity && userId !== null}>
      <div className="getting-started">
        <div className="brand-logo">
              <img src="/images/globy-logo.svg" alt="Brand logo" />
          </div>
        <div className="getting-started__container">
          <div className="identity-type">
            <div className="heading-container">
              <p className="heading">
                Let's create the perfect website for your needs
              </p>
              <p className="sub-heading">
                  What kind of website are you creating?
              </p>
            </div>

            <div className="identity-type__options">
              <div className={`option ${type === IdentityTypeEnum.PERSONAL ? 'selected' : ''}`} onClick={() => handleChangeType(IdentityTypeEnum.PERSONAL)}>
                <span className={`option__avatar ${type === IdentityTypeEnum.PERSONAL ? 'selected' : ''}`}>
                  <img src={UserIcon} alt="PersonalIcon" />
                </span>
                <div className='option__detail'>
                  <strong>Personal</strong>
                  <p>Personal website to share your own content.</p>
                </div>
              </div>
              <div className={`option ${type === IdentityTypeEnum.BUSINESS ? 'selected' : ''}`} onClick={() => handleChangeType(IdentityTypeEnum.BUSINESS)}>
                <span className={`option__avatar ${type === IdentityTypeEnum.BUSINESS ? 'selected' : ''}` }>
                  <img src={BriefcaseIcon} alt="Business Icon" />
                </span>
                <div className='option__detail'>
                  <strong>Business</strong>
                  <p>Professional website for your company or brand</p>
                </div>
              </div>


            </div>
            <div className='action-container'>
              <button
                onClick={handleClick}
                disabled={!type}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}