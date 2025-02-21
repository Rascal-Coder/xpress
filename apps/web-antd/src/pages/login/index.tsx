import { Button } from '@xpress-core/shadcn-ui';

import { useState } from 'react';

import { useAccessStore } from '#/stores';

export default function Login() {
  const setAccessToken = useAccessStore((state) => state.setAccessToken);
  const [_isLoading, setIsLoading] = useState(false);
  const authLogin = async () => {
    setIsLoading(true);
    const res = await fetch('http://localhost:5320/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'xpress',
        password: '123456',
      }),
    });
    const {
      data: { accessToken },
    } = await res.json();
    if (accessToken) {
      setAccessToken(accessToken);
    }
  };
  return <Button onClick={authLogin}>Login</Button>;
}
