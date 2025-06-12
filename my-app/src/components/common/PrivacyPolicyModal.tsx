import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { setConsent } from '@/store/UserSlice' // Assume this action exists
import { useTranslation } from 'react-i18next'

export default function PrivacyPolicyModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { t } = useTranslation('privacy')
  const dispatch = useDispatch<AppDispatch>()
  const consent = useSelector((state: RootState) => state.user.consent)

  const handleAccept = () => {
    dispatch(setConsent(true)) // Save consent to Redux store
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gradient-to-br from-gray-900/70 to-black/50 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white/90 backdrop-blur-md p-8 shadow-2xl border border-gray-100/50 overflow-y-auto max-h-[85vh] transform transition-all">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-3xl font-semibold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
                  {t('privacy.title')}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-100/50 rounded-full transition-all duration-200"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="text-base text-gray-700 space-y-6">
                <p className="leading-relaxed">
                  {t('privacy.description')}
                </p>

                <div className="border-t border-gray-200 pt-4">
                  <h2 className="font-medium text-xl text-orange-600 mb-3">{t('privacy.section1')}</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('privacy.item1')}</li>
                    <li>{t('privacy.item2')}</li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h2 className="font-medium text-xl text-orange-600 mb-3">{t('privacy.section2')}</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{t('privacy.item3')}</li>
                    <li>{t('privacy.item4')}</li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h2 className="font-medium text-xl text-orange-600 mb-3">{t('privacy.section3')}</h2>
                  <p className="leading-relaxed">
                    {t('privacy.contactText', { email: (
                      <a
                        href="mailto:support@reciperealm.com"
                        className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
                      >
                        support@reciperealm.com
                      </a>
                    ) })}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleAccept}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
                  disabled={consent} // Disable if already accepted
                >
                  {t('privacy.accept')}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}