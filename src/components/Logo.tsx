import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="font-bold text-2xl">
        <span className="text-blue-600">floca</span>
        <span className="text-gray-800">.id</span>
      </div>
    </Link>
  );
} 