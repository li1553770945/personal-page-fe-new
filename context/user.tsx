"use client"

import { create } from "zustand"
import { userInfoAPI, loginAPI,registerAPI } from "@/api"
type User = {
  username: string
  nickname: string
  avatar: string
} | null

type State = {
  user: User
}

type Result = {
  ok: boolean
  message: string
  data?: any
}
type LoginParams = {
  username: string
  password: string
}

type RegisterParams = LoginParams & {
  nickname: string
  activeCode: string
}
type Actions = {
  setUser: (u: User) => void
  clear: () => void
  logout: () => void
  refresh: () => Promise<Result>
  login: (params: LoginParams) => Promise<Result>
  register: (params: RegisterParams) => Promise<Result>
}

const useUserStore = create<State & Actions>((set, get) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  clear: () => set({ user: null }),
  logout: () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
    } catch {}
    set({ user: null })
  },
  refresh: async () => {
    try {
      const res: any = await userInfoAPI()
      if(res.code!=0)
      {
        return { ok: false, message: "刷新用户信息失败:"+res.message }
      }
      set({ user: res.data })
      return { ok: true, message: "刷新用户信息成功", data: res.data }
    } catch (error) {
      return { ok: false, message: "刷新用户信息失败:"+error }
    }
  },
  login: async (params) => {
    const res: any = await loginAPI(params)
    if(res.code!=0)
    {
      return { ok: false, message: "登录失败:"+res.message }
    }
    if (res?.code === 0 && res.data?.token) {
      localStorage.setItem("token", res.data.token)
      const refreshRes = await get().refresh()
      return { ok: true, message: "登录成功", data: refreshRes.data }
    }
    return { ok: true, message: "登录成功" }
  },
  register: async (params) => {
    const res: any = await registerAPI(params)
    if(res.code!=0)
    {
      return { ok: false, message: "注册失败:"+res.message }
    }
    return { ok: true, message: "注册成功" }
  },
  
}))

export function useUser() {
  const { user,setUser,refresh,login,clear,logout,register } = useUserStore()
  return { user,setUser,refresh,login,clear,logout,register }
}
