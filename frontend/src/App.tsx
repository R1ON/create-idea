import { BrowserRouter, Route, Routes } from "react-router-dom"
import { TrpcProvider } from "./lib/trpc"
import { AllIdeasPage } from "./screens/AllIdeasPage/AllIdeadPage"
import { IdeaPage } from "./screens/IdeaPage/IdeaPage"
import {
  getAllIdeasRoute,
  getIdeaRoute,
  getNewIdeaRoute,
  getSignInRoute,
  getSignUpRoute,
  ideaParams
} from "./lib/routes";
import { Layout } from './components/Layout';
import { NewIdeaPage } from './screens/NewIdeaPage/NewIdeaPage';
import { SignUpPage } from './screens/SignUpPage/SignUpPage';
import { SignInPage } from './screens/SignInPage/SignInPage';


export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path={getSignUpRoute()} element={<SignUpPage />} />
            <Route path={getSignInRoute()} element={<SignInPage />} />
            <Route path={getAllIdeasRoute()} element={<AllIdeasPage />} />
            <Route path={getNewIdeaRoute()} element={<NewIdeaPage />} />
            <Route path={getIdeaRoute(ideaParams)} element={<IdeaPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  )
}
