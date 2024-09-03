import { FrappeProvider, useFrappeAuth, FrappeConfig, FrappeContext } from 'frappe-react-sdk'
import { NextUIProvider } from "@nextui-org/react"
import React, { useEffect,useContext, useState }  from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import Login from './pages/login';
import Register from './pages/register';
import AlertProvider from './providers/AlertProvider';
import AuthProvider from './providers/AuthProvider'; 
import MainPage from './pages/Mainpage';  
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/Personal/ProfilePage';
import StreetcutoutIndex from './pages/Streetcutout/StreetcutoutIndex';
import StreetcutoutView from './pages/Streetcutout/StreetcutoutView';
import Requeststreetcutouttax from './pages/Streetcutout/Requeststreetcutouttax';
import RequeststreetcutouttaxCreate from './pages/Streetcutout/RequeststreetcutouttaxCreate';
import RequeststreetcutouttaxView from './pages/Streetcutout/RequeststreetcutouttaxView';
import RequeststreetcutoutEdit from './pages/Streetcutout/RequeststreetcutoutEdit';

import RequestLicensePayment from './pages/Streetcutout/RequestLicensePayment';

function App() {

	const CheckThedsabanUser = ({ children }: React.PropsWithChildren) => {
		const [isThedsabanUser, setIsThedsabanUser] = useState(null);
		let { call } = useContext(FrappeContext) as FrappeConfig;
		
	
		async function checkUserRole() {
			const getCheckThedsabanUser = await call.get('maechan.maechan.api.check_thedsaban_user_roles');
			setIsThedsabanUser(getCheckThedsabanUser.message);
		}
	
		useEffect(() => {
			checkUserRole();
			if (isThedsabanUser === false) {
				window.location.href = `/`
			}
		}, [isThedsabanUser]);
	
		return (
			<main>
				{isThedsabanUser && children}
			</main>
		);
	}
	

	
	const LoginGuard = ({ children }: React.PropsWithChildren) => {

		const auth = useFrappeAuth()
		const navigate = useNavigate()
		

		useEffect(() => {

			if (auth.isLoading) {

			} else {
				if (!auth.currentUser) {
					navigate("/login")
				}
			}
			
		}, [auth.isLoading])

		return (
			<main>
				{children}
			</main>
		)
	}

	console.log('test',import.meta.env.VITE_FRAPPE_URL ?? '')

	
	return (
		<div className="App">

			<NextUIProvider>
				<FrappeProvider url={import.meta.env.VITE_FRAPPE_URL ?? ''} socketPort={import.meta.env.VITE_SOCKET_PORT ?? ''}>
					<AlertProvider>
						<AuthProvider>
							<BrowserRouter>
								<Routes>
									<Route path='/login' element={<Login />} />
									<Route path='/register' element={<Register />} />
									<Route path="/" element={<LoginGuard><CheckThedsabanUser><MainPage/></CheckThedsabanUser></LoginGuard>} >
										<Route index element={<Dashboard />} />

										<Route path="StreetcutoutRequest">
											<Route index element={<Requeststreetcutouttax/>} />
											<Route path='create' />
											<Route path=':id/edit' element={<RequeststreetcutoutEdit />} />
											<Route path=':id/view' element={<RequeststreetcutouttaxView/>} />


										</Route>

										<Route path="profile">
											<Route index element={<ProfilePage />} />
										</Route>

									</Route>
								</Routes>
							</BrowserRouter>
						</AuthProvider>
					</AlertProvider>
				</FrappeProvider>
			</NextUIProvider>
		</div>
	)
}

export default App
