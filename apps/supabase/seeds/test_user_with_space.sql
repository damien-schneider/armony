SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'c9a42e80-cbee-4559-a246-a65f757cb3cb', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"test@mail.com","user_id":"cef604da-493a-4ce3-a38c-c6c9788b765b","user_phone":""}}', '2025-04-11 08:31:42.183437+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a84a1f1a-9d6e-4e78-962f-a2df3550fb64', '{"action":"login","actor_id":"cef604da-493a-4ce3-a38c-c6c9788b765b","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-11 08:31:58.032384+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'cef604da-493a-4ce3-a38c-c6c9788b765b', 'authenticated', 'authenticated', 'test@mail.com', '$2a$10$XN9hJL2vA8VN7MNw2XX36up.JmeFLojVlFwWBF6g9A2p5gT33c1Ay', '2025-04-11 08:31:42.185294+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-04-11 08:31:58.035334+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-04-11 08:31:42.177695+00', '2025-04-11 08:31:58.051923+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('cef604da-493a-4ce3-a38c-c6c9788b765b', 'cef604da-493a-4ce3-a38c-c6c9788b765b', '{"sub": "cef604da-493a-4ce3-a38c-c6c9788b765b", "email": "test@mail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-04-11 08:31:42.182512+00', '2025-04-11 08:31:42.182541+00', '2025-04-11 08:31:42.182541+00', '02136dea-49bc-4f45-897f-4b26352e5e53');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('ef06ab99-b44d-4673-ad75-915399d1ba76', 'cef604da-493a-4ce3-a38c-c6c9788b765b', '2025-04-11 08:31:58.035446+00', '2025-04-11 08:31:58.035446+00', NULL, 'aal1', NULL, NULL, 'node', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('ef06ab99-b44d-4673-ad75-915399d1ba76', '2025-04-11 08:31:58.053195+00', '2025-04-11 08:31:58.053195+00', 'password', '96add313-2475-48ab-90a2-292a0036542e');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'g91N4Dt_e4fHzZdlD9Jq4w', 'cef604da-493a-4ce3-a38c-c6c9788b765b', false, '2025-04-11 08:31:58.043338+00', '2025-04-11 08:31:58.043338+00', NULL, 'ef06ab99-b44d-4673-ad75-915399d1ba76');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "full_name", "avatar_url", "billing_address", "payment_method") VALUES
	('cef604da-493a-4ce3-a38c-c6c9788b765b', NULL, NULL, NULL, NULL);


--
-- Data for Name: ai-calls; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."ai-calls" ("id", "id_user", "ai_model", "completion_tokens", "prompt_tokens", "total_tokens", "computed_cost_in_euro", "created_at") VALUES
	(1, 'cef604da-493a-4ce3-a38c-c6c9788b765b', 'gemini-2.0-flash', 31, 110, 141, 2.1177000000000004e-05, '2025-04-11 08:32:36.85376+00'),
	(2, 'cef604da-493a-4ce3-a38c-c6c9788b765b', 'gemini-2.0-flash', 35, 146, 181, 2.5883000000000003e-05, '2025-04-11 08:33:27.675624+00');


--
-- Data for Name: spaces; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."spaces" ("id", "created_at", "updated_at", "deleted_at", "title", "content", "emoji", "id_user") VALUES
	('12eda02a-926b-4762-9db1-31aa8d2274a1', '2025-04-11 08:32:03.590186+00', '2025-04-11 08:32:03.590186+00', NULL, 'Test', 'My name is “Test”

I am a developer at Armony.ai', '🪐', 'cef604da-493a-4ce3-a38c-c6c9788b765b');


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."chats" ("id", "created_at", "updated_at", "deleted_at", "id_space", "title", "model", "messages", "created_by", "model_tone") VALUES
	('b5a4be35-a1a5-4ac5-af99-b5282039cf77', '2025-04-11 08:32:36.867525+00', '2025-04-11 08:33:27.685+00', NULL, '12eda02a-926b-4762-9db1-31aa8d2274a1', 'Name Retrieval Request', 'gemini-2.0-flash', '{"{\"role\": \"user\", \"parts\": [{\"text\": \"Hey, what''s my name?\", \"type\": \"text\"}], \"content\": \"Hey, what''s my name?\"}","{\"role\": \"assistant\", \"parts\": [{\"type\": \"step-start\"}, {\"text\": \"Hey there! 👋 Based on the context you''ve provided, your name is Test! 😊 Is there anything else I can help you with today?\\n\", \"type\": \"text\"}], \"content\": \"Hey there! 👋 Based on the context you''ve provided, your name is Test! 😊 Is there anything else I can help you with today?\\n\"}","{\"role\": \"user\", \"parts\": [{\"text\": \"Nice, well done!\", \"type\": \"text\"}], \"content\": \"Nice, well done!\"}","{\"id\": \"msg-eXqfKVDlPpt9lYyw4fhby0V6\", \"role\": \"assistant\", \"parts\": [{\"type\": \"step-start\"}, {\"text\": \"Awesome! Glad I could get that right for you, Test! 😄 Is there anything else I can help you with today? Maybe something about Armony.ai? 😉\\n\", \"type\": \"text\"}], \"content\": \"Awesome! Glad I could get that right for you, Test! 😄 Is there anything else I can help you with today? Maybe something about Armony.ai? 😉\\n\", \"createdAt\": \"2025-04-11T08:33:27.685Z\", \"toolInvocations\": []}"}', 'cef604da-493a-4ce3-a38c-c6c9788b765b', 'friendly');


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."customers" ("id", "stripe_customer_id") VALUES
	('cef604da-493a-4ce3-a38c-c6c9788b765b', 'cus_S6oyyotn0qQ2Kj');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: prices; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: snippets; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, true);


--
-- Name: ai-calls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."ai-calls_id_seq"', 2, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
