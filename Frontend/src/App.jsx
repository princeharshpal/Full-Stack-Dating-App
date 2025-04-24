import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import router from "./Router";
import Toast from "./components/Toast";

const App = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen w-full bg-base-100 text-base-content">
        <Toast />
        <RouterProvider
          router={router}
          fallbackElement={
            <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
              <span className="loading loading-spinner loading-lg text-info"></span>
            </div>
          }
        />
      </div>
    </Provider>
  );
};

export default App;
