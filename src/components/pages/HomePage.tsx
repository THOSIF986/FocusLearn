import { Target, Timer, BookMarked, Trophy } from 'lucide-react';
import { StatsCard } from '../StatsCard';
import { Button } from '../ui/button';

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-slate-900 mb-8">Welcome to FocusLearn</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<Target className="w-6 h-6" />}
          title="Learning Journey"
          value="Continue your current learning path"
          subtitle="Track your progress"
          iconColor="text-red-500"
        />

        <StatsCard
          icon={<Timer className="w-6 h-6" />}
          title="Study Hours"
          value="12.5h"
          subtitle="This week"
          iconColor="text-slate-600"
        />

        <StatsCard
          icon={<BookMarked className="w-6 h-6" />}
          title="Active Playlists"
          value="3"
          subtitle="In progress"
          iconColor="text-indigo-600"
        />

        <StatsCard
          icon={<Trophy className="w-6 h-6" />}
          title="Current Streak"
          value="7 days"
          subtitle="Keep it up!"
          iconColor="text-amber-500"
        />
      </div>

      {/* Additional Content Area */}
      <div className="mt-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 mb-2">Continue your current learning path</h3>
              <p className="text-slate-600 mb-4">Pick up where you left off and keep making progress on your goals.</p>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Start Learning
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
