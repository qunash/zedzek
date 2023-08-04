import { useSession, signIn } from 'next-auth/react';
import { useTranslations } from "next-intl"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Icons } from "./icons"
import { Button, buttonVariants } from "./ui/button"

const IconButton = ({ icon, onClick, clickedIcon = null, isClicked = false }) => (
  <div
    className={buttonVariants({
      size: "lg",
      variant: "ghost",
      className: "items-center justify-end self-starttext-slate-700 dark:text-slate-400 cursor-pointer"
    })}
    onClick={onClick}
  >
    {isClicked && clickedIcon ? clickedIcon : icon}
  </div>
);


const LoadingState = () => (
  <div className="h-80 w-full rounded-r-lg p-4 md:h-96">
    <div className="flex h-full flex-col items-center justify-center">
      <div className="h-5 w-5 animate-spin rounded-full border-y-2 border-gray-500" />
    </div>
  </div>
)

const EmptyState = () => (<div className="h-80 w-full rounded-r-lg p-4 md:h-96" />)

const SignInDiv = () => {
  const { locale } = useRouter()
  const t = useTranslations("Index")
  return (
    <div className="flex w-full flex-row items-center justify-center rounded-r-lg p-4">
      <Button onClick={() => signIn('google')}>
        {t('sign_in', { locale })}
      </Button>
    </div>
  )
}

const TranslationItem = ({ translation }) => <div>{translation}</div>

const TranslationPanel = ({ translationResponse, loading }) => {
  const { data: session, status } = useSession()
  const { locale } = useRouter()
  const t = useTranslations("Translator")

  const emptyState = {
    text: '',
    translations: [],
    duration: 0,
    iconClicked: { copy: false, upvote: false, downvote: false },
    upvoted: false,
    showSignIn: false
  };
  
  const [state, setState] = useState(emptyState);
  
  useEffect(() => {
    console.log('Translation response', translationResponse);
    if (translationResponse) {
      setState({
        ...translationResponse,
        iconClicked: { copy: false, upvote: false, downvote: false },
        upvoted: false,
        showSignIn: false,
      });
    } else {
      setState(emptyState);
    }
  }, [translationResponse])

  const onIconClick = async (event, type) => {
    event.currentTarget.blur()
    const updateState = newState => setState(prevState => ({ ...prevState, ...newState }))

    switch (type) {
      case 'copy':
        navigator.clipboard.writeText(state.translations[0])
        updateState({ iconClicked: { ...state.iconClicked, copy: true } })
        setTimeout(() => updateState({ iconClicked: { ...state.iconClicked, copy: false } }), 1500)
        break
      case 'upvote':
        if (status === 'unauthenticated') {
          updateState({ showSignIn: true });
        } else {
          const body = JSON.stringify({
            removeUpvote: state.upvoted,
            userId: session.user.id,
            text: state.text,
            translation: state.translations[0],
          })
          try {
            const response = await fetch('/api/supabase/handle-upvote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
            const data = await response.json()
            console.log('Translation updated', data);
            updateState({
              upvoted: data.upvoted,
              iconClicked: { ...state.iconClicked, upvote: !state.iconClicked.upvote, downvote: false }
            })
          } catch (error) {
            console.error('An error occurred while updating the translation:', error);
          }
        }
        break
      case 'downvote':
      case 'edit':
        if (status === 'unauthenticated') {
          updateState({ showSignIn: true })
        }
        break
    }
  }

  if (loading) return <LoadingState />
  if (state.translations.length === 0) return <EmptyState />

  return (
    <div className="min-h-80 md:min-h-96 h-fit w-full rounded-r-lg p-4">
      <div className="flex h-full flex-col items-center justify-center pt-4">
        <div className="h-full w-full overflow-y-auto p-4">
          <div className="text-xl">{state.translations[0]}</div>
          <div className="my-4 h-px w-full bg-gray-500" />
          <div className="flex w-full flex-row items-center justify-between">
            <IconButton
              icon={<Icons.thumbsUp className="h-4 w-4" />}
              clickedIcon={<Icons.thumbsUp className="h-4 w-4 fill-current" />}
              isClicked={state.iconClicked.upvote}
              onClick={e => onIconClick(e, 'upvote')}
            />
            <IconButton
              icon={<Icons.thumbsDown className="h-4 w-4" />}
              clickedIcon={<Icons.thumbsDown className="h-4 w-4 fill-current" />}
              isClicked={state.iconClicked.downvote}
              onClick={e => onIconClick(e, 'downvote')}
            />
            <IconButton
              icon={<Icons.edit className="h-4 w-4" />}
              onClick={e => onIconClick(e, 'edit')}
            />
            <IconButton
              icon={<Icons.copy className="h-4 w-4" />}
              clickedIcon={<Icons.check className="h-4 w-4" />}
              isClicked={state.iconClicked.copy}
              onClick={e => onIconClick(e, 'copy')}
            />
          </div>
          {state.showSignIn && <SignInDiv />}
          <div className="pb-2 pt-4 text-xl text-gray-500">{t("alternatives", { locale })}:</div>
          <div className="flex flex-col gap-2">
            {state.translations.slice(1).map((translation, index) => (
              <TranslationItem key={index} translation={translation} />
            ))}
          </div>
        </div>
        <div className="flex w-full flex-row items-center justify-between p-4">
          <div className="text-xs text-gray-500">
            {Math.round(state.duration * 100) / 100}s
          </div>
        </div>
      </div>
    </div>
  )
}

export default TranslationPanel