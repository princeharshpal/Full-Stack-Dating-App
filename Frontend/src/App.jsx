import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import router from "./Router";
import Toast from "./components/Toast";
const App = () => {
  return (
    <>
      <Provider store={store}>
        <Toast />
        <RouterProvider
          router={router}
          fallbackElement={
            <div className="w-full h-screen flex justify-center items-center">
              <span className="loading loading-spinner loading-lg text-info"></span>
            </div>
          }
        />
      </Provider>
    </>
  );
};

export default App;
