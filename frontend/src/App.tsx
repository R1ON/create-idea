import { BrowserRouter, Route, Routes } from "react-router-dom"
import { TrpcProvider } from "./lib/trpc"
import { AllIdeasPage } from "./screens/AllIdeasPage/AllIdeadPage"
import { IdeaPage } from "./screens/IdeaPage/IdeaPage"
import {
  getAllIdeasRoute,
  getIdeaRoute,
  getNewIdeaRoute,
  getSignInRoute, getSignOutRoute,
  getSignUpRoute, getUpdateIdeaRoute,
  ideaParams
} from "./lib/routes";
import { Layout } from './components/Layout';
import { NewIdeaPage } from './screens/NewIdeaPage/NewIdeaPage';
import { SignUpPage } from './screens/SignUpPage/SignUpPage';
import { SignInPage } from './screens/SignInPage/SignInPage';
import { SignOutPage } from './screens/SignOutPage/SignOutPage';
import { UpdateIdeaPage } from './screens/UpdateIdeaPage/UpdateIdeaPage';
import { AppContextProvider } from './lib/ctx';
import { NotFoundPage } from './screens/NotFoundPage/NotFoundPage';


export const App = () => {
  return (
    <TrpcProvider>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={getSignOutRoute()} element={<SignOutPage />} />

            <Route element={<Layout />}>
              <Route path={getSignUpRoute()} element={<SignUpPage />} />
              <Route path={getSignInRoute()} element={<SignInPage />} />
              <Route path={getAllIdeasRoute()} element={<AllIdeasPage />} />
              <Route path={getNewIdeaRoute()} element={<NewIdeaPage />} />
              <Route path={getIdeaRoute(ideaParams)} element={<IdeaPage />} />
              <Route path={getUpdateIdeaRoute(ideaParams)} element={<UpdateIdeaPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </TrpcProvider>
  )
}
