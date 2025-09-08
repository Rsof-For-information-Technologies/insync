"use client"
import { routes } from '@/config/routes'
import { useIsMounted } from '@/hooks/useIsMounted'
import { useUserStore } from '@/store/user.store'
import { Params } from '@/types/params'
import { User } from '@/types/user'
import { getLocalStorage, removeLocalStorage } from '@/utils/localStorage'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

type T_UnAuthenticate = {
    children: React.ReactNode;
    navigate?: boolean;
}

function UnAuthenticated({ children, navigate = false }: T_UnAuthenticate) {
    const { setUserInfo, userInfo } = useUserStore();
    const searchParams = useSearchParams()
    const isMounted = useIsMounted();
    const router = useRouter();
    const { locale } = useParams<Params>();

    console.log("UnAuthenticated Rendered", { userInfo, searchParams })

    const logout = searchParams.get("logout")
    useEffect(() => {
        if (isMounted) {
            if (logout === "true") {
                const urlSearchParams = new URLSearchParams(searchParams.toString());

                removeLocalStorage("user-info");
                setUserInfo()
                urlSearchParams.delete("logout");
                router.push(`/${locale}${routes.auth.login}?${urlSearchParams}`)
            }
            else if (getLocalStorage("user-info"))
                setUserInfo(getLocalStorage("user-info") as User)
        }
    }, [logout, setUserInfo, router, searchParams, isMounted])

    useEffect(() => {
        if (isMounted) {
            if (userInfo && navigate)
                router.push("/")
        }
    }, [userInfo, router, navigate, isMounted])

    if (!userInfo) return (
        <>
            {children}
        </>
    )
    else
        return null

}

export default UnAuthenticated