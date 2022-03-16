import useSWR from 'swr'
import axios from 'lib/axios'
import {useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom';

export const useAuth = ({middleware, redirectIfAuthenticated} = {}) => {
  let navigate = useNavigate();
  let params = useParams();

  const {data: user, error, mutate} = useSWR('/api/user', () =>
    axios
      .get('/api/user')
      .then(res => res.data)
      .catch(error => {
        if (error.response.status !== 409) throw error

        mutate('/verify-email')
      }),
  {
    revalidateIfStale: false,
    revalidateOnFocus: false
  }
  )

  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const register = async ({setErrors, ...props}) => {
    await csrf()
    setErrors([])
    axios
      .post('/register', props)
      .then(() => mutate())
      .catch(error => {
        if (error.response.status !== 422) throw error
        setErrors(Object.values(error.response.data.errors).flat())
      })
  }

  const login = async ({setErrors, setStatus, ...props}) => {
    await csrf()
    setErrors([])
    setStatus(null)
    axios
      .post('/login', props)
      .then(() => mutate())
      .catch(error => {
        if (error.response.status !== 422) throw error
        setErrors(Object.values(error.response.data.errors).flat())
      })
  }

  const forgotPassword = async ({setErrors, setStatus, email}) => {
    await csrf()
    setErrors([])
    setStatus(null)
    axios
      .post('/forgot-password', {email})
      .then(response => setStatus(response.data.status))
      .catch(error => {
        if (error.response.status !== 422) throw error
        setErrors(Object.values(error.response.data.errors).flat())
      })
  }

  const resetPassword = async ({setErrors, setStatus, ...props}) => {
    await csrf()
    setErrors([])
    setStatus(null)
    axios
      .post('/reset-password', {token: params.token, ...props})
      .then(response => navigate(`/login?reset=${  btoa(response.data.status)}`))
      .catch(error => {
        if (error.response.status !== 422) throw error
        setErrors(Object.values(error.response.data.errors).flat())
      })
  }

  const resendEmailVerification = ({setStatus}) => {
    axios
      .post('/email/verification-notification')
      .then(response => setStatus(response.data.status))
  }

  const logout = async () => {
    if (!error) {
      await axios.post('/logout')
      mutate()
    }
    window.location.pathname = '/login'
  }

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user) navigate(redirectIfAuthenticated)
    if (middleware === 'auth' && error) logout()
  }, [user, error])

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout
  }
}
