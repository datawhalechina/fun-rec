export default function contains(root, n) {
  if (!root) {
    return false;
  }

  return root.contains(n);
}