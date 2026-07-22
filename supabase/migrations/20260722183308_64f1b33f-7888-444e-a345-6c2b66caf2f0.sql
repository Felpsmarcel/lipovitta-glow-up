DROP POLICY "Anyone can submit an affiliate application" ON public.affiliate_applications;

ALTER TABLE public.affiliate_applications
  ADD CONSTRAINT affiliate_full_name_len CHECK (char_length(full_name) BETWEEN 2 AND 120),
  ADD CONSTRAINT affiliate_phone_len CHECK (char_length(phone) BETWEEN 8 AND 30),
  ADD CONSTRAINT affiliate_email_fmt CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND char_length(email) <= 255),
  ADD CONSTRAINT affiliate_followers_range_chk CHECK (followers_range IN ('ate_1k','1k_10k','10k_50k','50k_100k','100k_mais')),
  ADD CONSTRAINT affiliate_state_chk CHECK (state IN ('AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO')),
  ADD CONSTRAINT affiliate_status_chk CHECK (status IN ('pending','approved','rejected','contacted'));

CREATE POLICY "Public can submit affiliate applications"
  ON public.affiliate_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND char_length(full_name) BETWEEN 2 AND 120
    AND char_length(email) BETWEEN 5 AND 255
  );