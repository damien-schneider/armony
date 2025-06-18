CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


create policy "Give users access to own folder 1yhuiye_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'generated-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1yhuiye_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'generated-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1yhuiye_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'generated-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1yhuiye_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'generated-images'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));



