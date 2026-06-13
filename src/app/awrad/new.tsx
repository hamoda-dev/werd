import { useRouter } from "expo-router";
import { WardForm, type WardValues } from "@/components/ward-form";
import { useCustomAwrad } from "@/store/store";

export default function NewWard() {
  const router = useRouter();
  const { add } = useCustomAwrad();

  function handleSubmit(values: WardValues) {
    add(values);
    router.back();
  }

  return (
    <WardForm
      heading="وِرد جديد"
      submitLabel="حفظ الوِرد"
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
