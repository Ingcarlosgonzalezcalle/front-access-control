import React, { useState, useEffect  } from 'react';
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logIn, logOut } from '../../../redux/slices/SessionSlice';
import authService from '../../../services/auth-service';
import logo_1 from '../../../assets/images/logo.png'
import { Spin } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {


  console.log(window.location)

  const dispath = useDispatch();
  let navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm();


  const customSubmit = async (data) => {
    const client = data.client
    const username = data.username
    const password = data.password
    const params = { username, password }
    const response = await authService.login(params, client)

    if (response) {
      if (response.success) {
        const state = true;
        const name = response.name
        const token = response.token
        const role = response.role
        const userId = response.userId
        const user = response.username



        if (role == "ADMINISTRADOR"||role == "SUPERADMIN"||role == "DIGITADOR") {
          localStorage.setItem("isLogin", true);
          localStorage.setItem("token", token)
          localStorage.setItem("name", name)
          localStorage.setItem("username", username);
          localStorage.setItem("userId", userId);
          localStorage.setItem("role", role);

          dispath(logIn({ isLogin_param: state, token_param: token }))
          window.location.href = '/';
          toast("Login exitoso", { autoClose: 1500 })
        }
        else {          
          toast("Login fallido", { autoClose: 1500 })
          dispath(logOut({ isLogin: false, token: "NOK" }))
          localStorage.setItem("isLogin", false);
          window.location.href = '/login';
        }
      }
      else {
        const message = response.response.data.message
        toast.error(message)
      }
    }
  };

  const toLowerCaseClient   = (e) => {
    let value = e.target.value;  
    value = value.toLowerCase()
    setValue("client", value);
  };



  const toLowerCaseUsername   = (e) => {
    let value = e.target.value;  
    value = value.toLowerCase()
    setValue("username", value);
  };


  useEffect(() => {
    const lastClient = localStorage.getItem("lastClient");
    if (lastClient) {
      setValue("client", lastClient);
    }
  }, [setValue]);

  

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <ToastContainer />
      <div className='container p-4'>
        <div className=' card mt-4  shadow p-3'>
          <div className="">
            <hr></hr>
          </div>
          <section className="p-4">
            <div className="container-fluid h-custom">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-md-9 col-lg-6 col-xl-5">
                  <img src={logo_1} className="img-fluid" alt="Sample image" />
                </div>
                <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                  <h4>Inicio de sesión</h4>
                  <form
                    className="form-react"
                    onSubmit={handleSubmit(customSubmit)}
                  >
                    <div className="row">
                      <div className="card-title">
                        <h4 className="text-secondary" ></h4>
                      </div>



                      <div className=" col-12">
                        <label>Username</label>
                        <input
                          type="text"      
                          onKeyUp={toLowerCaseUsername}
                          className="form-control"
                          {...register("username", { required: true })}
                        />
                        {errors.username?.type === "required" && (
                          <small className="text-danger">Campo requerido</small>
                        )}
                      </div>


                      <div className="col-12">
                        <label>Password</label>
                        <Controller
                          name="password"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => <Input.Password {...field} placeholder="input password" />}
                        />
                        {errors.password?.type === "required" && (
                          <small className="text-danger">Campo requerido</small>
                        )}
                      </div>




                      <div className=" col-6" >
                        <label>&nbsp; </label>

                        <Spin spinning={loading}>
                          <button className="btn btn-primary w-100" type="submit">
                            <i className="bi bi-box-arrow-in-right m-2"></i> Login
                          </button>
                        </Spin>
                      </div>


                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="">
              <hr></hr>
            </div>
          </section>
        </div>

      </div>
    </div>

  );
};

export default Login;
