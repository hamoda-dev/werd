import type { ReactNode } from "react";
import { ScrollView, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { Blobs } from "@/components/blobs";
import type { Gradients } from "@/theme/types";

interface Props {
  children: ReactNode;
  /** Which background gradient to paint. */
  gradient?: keyof Gradients;
  /** Scroll the content (default) or render a padded fixed View. */
  scroll?: boolean;
  /** Decorative pastel background blobs. Defaults to the active theme's `blobs` feature. */
  blobs?: boolean;
  /** Override/extend the content container padding (e.g. edge-to-edge headers). */
  contentStyle?: ViewStyle;
}

/** Screen scaffold: gradient background + (themed) blobs + safe-area + standard padding. */
export function Screen({ children, gradient = "darkScreen", scroll = true, blobs, contentStyle }: Props) {
  const { semantic, gradients, features } = useTheme();
  const insets = useSafeAreaInsets();
  const showBlobs = blobs ?? features.blobs;
  const content: ViewStyle = {
    paddingTop: insets.top + spacing.lg,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: semantic.screen,
        experimental_backgroundImage: gradients[gradient],
      }}
    >
      {showBlobs ? <Blobs /> : null}
      {scroll ? (
        <ScrollView contentContainerStyle={[content, contentStyle]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, content, { paddingBottom: insets.bottom + spacing.xxl }, contentStyle]}>
          {children}
        </View>
      )}
    </View>
  );
}
