import { Clock } from 'lucide-react';

interface ComingSoonProps {
  pageName: string;
}

export function ComingSoon({ pageName }: ComingSoonProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-indigo-100 flex items-center justify-center">
          <Clock className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-slate-900 mb-3">{pageName}</h2>
        <p className="text-slate-600">This feature is coming soon. Stay tuned!</p>
      </div>
    </div>
  );
}
