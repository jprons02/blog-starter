const verifyCaptcha = async (token: string): Promise<boolean> => {
  const RECAPTCHA_API_KEY = process.env.NEXT_PUBLIC_LAMBDA_RECAPTCHA_SITE_KEY!;
  const res = await fetch(
    "https://i8mdaugn84.execute-api.us-east-1.amazonaws.com/prod/v3",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": RECAPTCHA_API_KEY,
      },
      body: JSON.stringify({ token }),
    }
  );

  const data = await res.json();
  return data.success && data.score >= 0.5;
};

export default verifyCaptcha;
