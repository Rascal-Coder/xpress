export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };
    // eslint-disable-next-line no-console
    console.log('Success:', values);
  };

  return (
    <div className="mx-auto mt-8 max-w-md">
      <h1 className="mb-6 text-2xl font-bold">登录</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="username"
          >
            用户名
          </label>
          <input
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            id="username"
            name="username"
            required
            type="text"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            密码
          </label>
          <input
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            id="password"
            name="password"
            required
            type="password"
          />
        </div>

        <button
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="submit"
        >
          登录
        </button>
      </form>
    </div>
  );
}
