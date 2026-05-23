import { useContext, useEffect } from 'react'
import { AuthContext } from '../auth.context'
import { login, register, logout, getMe } from '../services/auth.api'
import api from '../../../lib/api'

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    // const handleLogin = async ({ email, password }) => {
    //     setLoading(true)
    //     try {
    //         const data = await login({ email, password })
    //         setUser(data.user)
    //     } catch (error) {
    //         console.error('Login failed:', error)
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    const handleLogin = async (data) => {

        try {

            setLoading(true);

            const response = await api.post(
                "/api/auth/login",
                data
            );

            setUser(response.data.user);

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            return true;

        } catch (error) {

            console.error(error);

            return false;

        } finally {

            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)

        try {
            const data = await register({ username, email, password })

            if (!data) {
                throw new Error("No response from server")
            }

            setUser(data.user)

            return true

        } catch (error) {
            console.error('Register failed:', error)
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            setLoading(false)
        }
    }

    // useEffect(() => {
    //     const getAndSetUser = async () => {
    //         try {
    //             const data = await getMe();
    //             setUser(data.user);
    //         } catch (error) {
    //             setUser(null);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     getAndSetUser();
    // }, []);

    const getCurrentUser = async () => {

        try {

            const response = await api.get(
                "/api/auth/get-me"
            );

            setUser(response.data.user);

        } catch (error) {

            setUser(null);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    return { user, setUser, loading, setLoading, handleLogin, handleRegister, handleLogout }
}
