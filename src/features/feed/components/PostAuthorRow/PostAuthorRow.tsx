import { Colors, Radius, Spacing, Typography } from '@/src/shared/design';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Author } from '../../types';

type Props = {
  author: Author;
  /** Avatar diameter. Default 40. */
  avatarSize?: number;
  /** Show verified badge. Default false. */
  showVerified?: boolean;
  /** Second line under display name. */
  subtitle?: string;
};

export const PostAuthorRow = React.memo(function PostAuthorRow({
  author,
  avatarSize = 40,
  showVerified = false,
  subtitle,
}: Props) {
  const avatarStyle = { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 };

  return (
    <View style={styles.row}>
      <View style={styles.avatarWrap}>
        {author.avatarUrl ? (
          <Image
            source={{ uri: author.avatarUrl }}
            style={avatarStyle}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[avatarStyle, styles.avatarFallback]}>
            <Text style={styles.avatarInitial}>
              {author.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {showVerified && author.isVerified && (
          <View style={styles.badge}>
            <Ionicons name="checkmark" size={8} color={Colors.white} />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {author.displayName}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
  },
  avatarWrap: { position: 'relative' },
  avatarFallback: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  name: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
});
