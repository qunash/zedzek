import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { PartialLocation, QueryParamAdapterComponent } from "use-query-params"

const NextQueryParamAdapter: QueryParamAdapterComponent = ({
  children,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const adapter = useMemo(() => {
    function getUrl(location: PartialLocation) {
      let url = pathname
      if (location.search) {
        url += location.search
      }
      if (window.location.hash) {
        url += window.location.hash
      }
      return url
    }

    return {
      replace(location: PartialLocation) {
        // router.replace(getUrl(location))
        history.replaceState(null, '', getUrl(location))
      },
      push(location: PartialLocation) {
        router.push(getUrl(location))
      },
      location: {
        search: searchParams.toString()
      }
    }
  }, [searchParams, pathname, router])

  return children(adapter)
}

export default NextQueryParamAdapter