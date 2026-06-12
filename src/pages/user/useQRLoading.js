import { LoginQRCode, GetLoginCheckStatus } from '@/utils/api'

export default function useQRLogin(loginSuccess) {
  let showQRCode = false
  let QRLoading = false
  let QRExpired = 0
  let isExpired = false
  let QRToken = ''
  let timer = null

  async function showQR() {
    showQRCode = true
    QRLoading = true

    try {
      const response = await LoginQRCode()
      QRExpired = response.data?.Exp * 1000
      QRToken = response.data?.Token
      isExpired = false
      checkLoginStatus()
    } catch (error) {}
    QRLoading = false
  }

  function hideQR() {
    showQRCode = false
    onExpired()
  }

  function checkLoginStatus() {
    timer = setTimeout(() => {
      handleCheckLoginStatus()
    }, 2000)
  }

  async function handleCheckLoginStatus() {
    try {
      const response = await GetLoginCheckStatus({
        token: QRToken,
      })
      loginSuccess(response)
    } catch (error) {
      if (isExpired === false) {
        checkLoginStatus()
      }
    }
  }

  function onExpired() {
    isExpired = true
    if (timer) {
      clearTimeout(timer)
    }
  }

  return {
    data: {
      showQRCode,
      QRLoading,
      QRExpired,
      isExpired,
      QRToken,
    },
    computedProps: {
      showQRCode() { return showQRCode },
      QRLoading() { return QRLoading },
      QRExpired() { return QRExpired },
      isExpired() { return isExpired },
      QRDataText() { return QRToken },
    },
    methods: {
      showQR,
      hideQR,
      onExpired,
    }
  }
}
