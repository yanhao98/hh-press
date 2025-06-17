declare module 'virtual:auth-config' {
  export const protectedRoutes: Record<
    string,
    {
      password: string;
      redirectUrl: string;
    }
  >;
}
