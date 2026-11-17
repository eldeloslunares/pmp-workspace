import styles from './Badge.module.css';

interface BadgeProps {
  label: string;
  color: string;
  variant?: 'filled' | 'outline';
}

export default function Badge({ label, color, variant = 'filled' }: BadgeProps) {
  const style = variant === 'filled'
    ? { backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color }
    : { border: `1.5px solid ${color}`, color, background: 'transparent' };

  return (
    <span className={styles.badge} style={style}>
      {label}
    </span>
  );
}
