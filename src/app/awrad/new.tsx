import { useRouter } from "expo-router";
import { WardForm, type WardValues } from "@/components/ward-form";
import { useAdhkariCategories, useCustomAwrad, useCustomCategories } from "@/store/store";

export default function NewWard() {
  const router = useRouter();
  const { add } = useCustomAwrad();
  const categories = useAdhkariCategories();
  const { add: addCategory } = useCustomCategories();

  function handleSubmit(values: WardValues) {
    add(values);
    router.back();
  }

  return (
    <WardForm
      heading="ذِكر جديد"
      submitLabel="حفظ"
      categories={categories}
      onCreateCategory={addCategory}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
