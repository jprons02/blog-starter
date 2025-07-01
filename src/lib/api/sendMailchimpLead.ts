import type { BenefitForm } from "@/lib/types/benefit";

const sendMailchimpLead = async (data: BenefitForm): Promise<Response> => {
  const API_ENDPOINT =
    "https://xjsx1og5tf.execute-api.us-east-1.amazonaws.com/prod/mailchimp";
  const API_KEY = process.env.NEXT_PUBLIC_LAMBDA_BLOG_API_KEY!;
  const LIST_ID = process.env.NEXT_PUBLIC_MAILCHIMP_LIST_ID!;

  const payload = {
    listId: LIST_ID,
    email: data.EMAIL,
    merge_fields: {
      FNAME: data.FNAME,
      LNAME: data.LNAME,
      PHONE: data.PHONE,
      STATE: data.STATE || "",
      CITY: data.CITY || "",
      ZIP: data.ZIP,
      HSHLDSIZE: data.HSHLDSIZE.toString(),
      INCOME: data.INCOME,
      FACTORS: data.FACTORS.join(", "),
      PAYSUTILS: data.PAYSUTILS,
      WEBSITE: data.WEBSITE,
    },
  };

  const res = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(payload),
  });

  return res;
};

export default sendMailchimpLead;
