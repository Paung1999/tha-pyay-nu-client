import { useApp } from "../providers/AppProvider";
import { useNavigate } from "react-router-dom";
import {
  House,
  History,
  LogIn,
  ClipboardPen,
  Library,
  X,
  LogOut,
} from "lucide-react";
import {logoutAction, selectUser} from "../libs/features/auth/authSlice.ts";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {useLogoutMutation} from "../libs/features/auth/authApiSlice.ts";
import {apiSlice} from "../libs/features/api/apiSlice.ts";

export default function AppDrawer() {
  const {openDrawer, setOpenDrawer} = useApp()!;
  const auth = useAppSelector(selectUser);
  const [logoutRequest] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!openDrawer) return null;

  const handleLogout = async () => {
    try {
      await logoutRequest(undefined).unwrap();
      navigate("/");
      setOpenDrawer(false);
    } finally {
      dispatch(logoutAction());
      dispatch(apiSlice.util.resetApiState());
      navigate("/");
    }
  }

    return (
        <div>
          <div className="flex flex-col justify-start item-center bg-slate-900 h-full w-72 fixed inset-y-0 left-0 z-50">
            <div
                className="flex flex-row justify-start items-center bg-slate-900/80 backdrop-blur-md p-3 y-10 gap-2 relative">
              <button className="text-gray-200 m-auto absolute right-2 top-2 mt-1">
                <X onClick={() => setOpenDrawer(false)}/>
              </button>
              <div className="flex flex-row justify-center items-center p-3 gap-3">
                <Library className="text-slate-300"/>
                <h1 className="font-semibold font-sans text-2xl text-yellow-500">
                  ThaPyayNu
                </h1>
              </div>
            </div>

            <div className="flex flex-col h-full w-full justify-start items-start gap-2 p-2">
              <div className="w-full flex flex-col gap-2">
                <button
                    onClick={() => {
                      navigate("/");
                      setOpenDrawer(false);
                    }}
                    className="flex flex-row justify-center items-center gap-2 py-2 bg-slate-300 hover:bg-slate-400 rounded-md w-full "
                >
                  <div className="flex flex-row justify-start items-start gap-2">
                    <House/>
                    <p className="font-semibold font-sans text-slate-900">Home</p>
                  </div>
                </button>

                {auth && (
                    <button
                        onClick={() => {
                          navigate("/orders");
                          setOpenDrawer(false);
                        }}
                        className="flex flex-row justify-center items-center gap-2 py-2 bg-slate-300 hover:bg-slate-400 rounded-md w-full"
                    >
                      <History/>
                      <p className="font-semibold font-sans text-slate-900">Orders</p>
                    </button>
                )}
                {!auth && (
                    <>
                      <button
                          onClick={() => {
                            navigate("/sign-in");
                            setOpenDrawer(false);
                          }}
                          className="flex flex-row justify-center items-center gap-2 py-2 bg-slate-300 hover:bg-slate-400 rounded-md w-full"
                      >
                        <LogIn/>
                        <p className="font-semibold font-sans text-slate-900">Sign In</p>
                      </button>
                      <button
                          onClick={() => {
                            navigate("/sign-up");
                            setOpenDrawer(false);
                          }}
                          className="flex flex-row justify-center items-center gap-2 py-2 bg-slate-300 hover:bg-slate-400 rounded-md w-full"
                      >
                        <ClipboardPen/>
                        <p className="font-semibold font-sans text-slate-900">Register</p>
                      </button>
                    </>
                )}
              </div>

              <div className="mt-auto w-full">
                {auth && (
                    <button
                        onClick={handleLogout}
                        className="flex flex-row justify-center items-center gap-2 py-2 bg-slate-800 hover:bg-slate-700  rounded-md w-full"
                    >
                      <LogOut className="text-red-500"/>
                      <p className="font-semibold font-sans text-red-500">Sign out</p>
                    </button>
                )}
              </div>
            </div>
          </div>

          <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpenDrawer(false)}
          ></div>
        </div>
    );
  }

