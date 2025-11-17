import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAppContext } from '~/providers/AppContextProvider';
import Modal from '../ui/Modal/Modal';
import { getIdentity, setIdentity } from '~/services/identityApis';
import { IdentityTypeEnum } from '~/types/enums';
import SpinnerLoading from '../ui/SpinnerLoading/SpinnerLoading';
import type { AxiosError } from 'axios';


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
  const [isLoading, setIsLoading] = useState(false);

  const [type, setType] = useState<IdentityTypeEnum | null>(null)
  const setIdentityType = async () => {
    if (!userId || !type) return
    try {
      const res = await setIdentity(userId, type)
      if (res?.status === 200) {
        onContinue()
      }
    } catch (error) {
      toast.error((error as AxiosError).message|| "Unable to set identity type");
      console.log('error')
    }
  }


  useEffect(() => {

    async function checkIdentity() {
      if (!userId) return
      try {
        const res = await getIdentity(userId)
        console.log(res)
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
      {
        isLoading && <SpinnerLoading />
      }
      <div className="getting-started">
        <div className="getting-started__container">
          <div className='identity-type'>
            <p className="sub-heading">
              Do you want your website to be for a business or for personal use?
            </p>

            <div className="identity-type__options">
              <div className={`option ${type === IdentityTypeEnum.PERSONAL ? 'selected' : ''}`} onClick={() => handleChangeType(IdentityTypeEnum.PERSONAL)}>
                <span className='option__avatar'>
                  {/* <FontAwesomeIcon icon={faHouse} /> */}
                </span>
                <div className='option__detail'>
                  <strong>Personal</strong>
                  <p>Personal website to share your own content.</p>
                </div>
              </div>
              <div className={`option ${type === IdentityTypeEnum.BUSINESS ? 'selected' : ''}`} onClick={() => handleChangeType(IdentityTypeEnum.BUSINESS)}>
                <span className='option__avatar'>
                  {/* <FontAwesomeIcon icon={faBriefcase} /> */}
                </span>
                <div className='option__detail'>
                  <strong>Business</strong>
                  <p>Professional website for your company or brand</p>
                </div>
              </div>


            </div>
            <button
              onClick={handleClick}
              disabled={!type}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}