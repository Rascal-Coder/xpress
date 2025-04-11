import type { RJSFSchema, RJSFValidationError } from '@rjsf/utils';

import { Authentication } from '@xpress/layouts';
import { useAccessStore } from '@xpress/stores';
import { StorageManager } from '@xpress/utils';

import validator from '@rjsf/validator-ajv8';
import { useState } from 'react';

import Form from '#/components/MForm/src';
import { baseUrl } from '#/constants/baseurl';

export default function Login() {
  // 初始化存储管理器
  const storageManager = new StorageManager({ prefix: 'login' });

  // 定义登录表单的schema
  const schema: RJSFSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: {
        type: 'string',
        title: '用户名',
        minLength: 1,
      },
      password: {
        type: 'string',
        title: '密码',
        minLength: 1,
      },
      remember: {
        type: 'boolean',
        title: '记住密码',
        default: false,
      },
    },
  };
  // 获取本地存储的用户凭据
  const formData = {
    username: storageManager.getItem<string>('remember_username', '') || '',
    password: storageManager.getItem<string>('remember_password', '') || '',
    remember: !!storageManager.getItem('remember_username'),
  };

  const setAccessToken = useAccessStore((state) => state.setAccessToken);
  const [isLoading, setIsLoading] = useState(false);

  const transformErrors = (errors: RJSFValidationError[]) => {
    return errors.map((error) => {
      if (error.property) {
        const field = error.property.replace('.', '');
        if (field === 'username') {
          if (error.name === 'required') {
            error.message = '请输入用户名';
          } else if (error.name === 'minLength') {
            error.message = '用户名不能为空';
          }
        } else if (field === 'password') {
          if (error.name === 'required') {
            error.message = '请输入密码';
          } else if (error.name === 'minLength') {
            error.message = '密码不能为空';
          }
        }
      }

      return error;
    });
  };

  // 定义登录表单的UI schema
  const uiSchema = {
    username: {
      'ui:placeholder': '请输入用户名/xpress',
      'ui:autofocus': true,
    },
    password: {
      'ui:widget': 'password',
      'ui:placeholder': '请输入密码/123456',
    },
    remember: {
      'ui:widget': 'checkbox',
    },
    'ui:submitButtonOptions': {
      norender: false,
      submitText: isLoading ? '登录中...' : '登录',
      props: {
        disabled: isLoading,
        className: 'mt-6 h-10 w-full bg-primary text-primary-foreground',
      },
    },
    // 禁用默认的错误列表
    'ui:ErrorList': () => null,
  };

  // 登录处理函数
  const onSubmit = async (e: any) => {
    setIsLoading(true);
    const formValues = e.formData;
    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formValues.username,
          password: formValues.password,
        }),
      });
      const {
        data: { accessToken },
      } = await res.json();
      if (accessToken) {
        setAccessToken(accessToken);

        // 如果勾选了记住密码，将用户凭据保存到存储
        if (formValues.remember) {
          storageManager.setItem('remember_username', formValues.username);
          // 注意：在实际生产环境中，不应该直接存储密码
          // 这里仅作为示例，实际应用中应该采用更安全的做法
          storageManager.setItem('remember_password', formValues.password);
        } else {
          // 如果未勾选，清除之前保存的凭据
          storageManager.removeItem('remember_username');
          storageManager.removeItem('remember_password');
        }
      }
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Authentication
      appName="Xpress Admin"
      logo="/images/logo.svg"
      pageDescription="工程化、高性能、跨组件库的前端模版"
      pageTitle="开箱即用的大型中后台管理系统"
    >
      <div className="w-full space-y-6 py-8">
        <div className="mb-7 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-foreground mb-3 text-3xl font-bold leading-9 tracking-tight lg:text-4xl">
            欢迎回来 👋🏻
          </h2>

          <p className="text-muted-foreground lg:text-md text-sm">
            <span className="text-muted-foreground">
              请输入您的帐户信息以开始管理您的项目
            </span>
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <Form
            className="space-y-4"
            formData={formData}
            noHtml5Validate
            onSubmit={onSubmit}
            schema={schema}
            showErrorList={false}
            transformErrors={transformErrors}
            uiSchema={uiSchema}
            validator={validator}
          />
          {/* <Button variant="contained">Hello world</Button> */}
          {/* 其他登录方式 */}
          <div className="mt-6">
            <div className="mt-4 flex items-center justify-between">
              <span className="border-input w-[35%] border-b dark:border-gray-600"></span>
              <span className="bg-background text-muted-foreground rounded-sm p-2 text-sm">
                其他登录方式
              </span>
              <span className="border-input w-[35%] border-b dark:border-gray-600"></span>
            </div>

            <div className="mt-6 flex justify-center space-x-6">
              <button
                className="bg-background hover:bg-accent inline-flex h-10 w-10 items-center justify-center rounded-full border p-2 transition-colors"
                title="Google登录"
                type="button"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                    fill="#34A853"
                  />
                  <path
                    d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                    fill="#4A90E2"
                  />
                  <path
                    d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                    fill="#FBBC05"
                  />
                </svg>
              </button>
              <button
                className="bg-background hover:bg-accent inline-flex h-10 w-10 items-center justify-center rounded-full border p-2 transition-colors"
                title="GitHub登录"
                type="button"
              >
                <svg
                  className="text-foreground h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Authentication>
  );
}
