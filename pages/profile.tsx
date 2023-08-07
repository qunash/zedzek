
export default function ProfilePage() {

  return (
    <div className="container grid items-center justify-items-center gap-6 pb-8 pt-6 md:py-10">
      <p>Profile</p>
    </div>
  )
}

export async function getStaticProps(context) {
  return {
    props: {
      messages: {
        ...(await import(`../messages/index/${context.locale}.json`)).default,
      },
    },
  }
}
