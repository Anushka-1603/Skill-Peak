import React, { useEffect, useState, useCallback } from 'react';
import API from '../../services/api';
import { FaTrophy, FaGithub, FaCode } from 'react-icons/fa';

const motivationalQuotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Strive for progress, not perfection.",
    "The expert in anything was once a beginner.",
    "Push yourself, because no one else is going to do it for you.",
    "Your limitation—it's only your imagination.",
    "Every accomplishment starts with the decision to try.",
    "So much to do, So little done!",

];

const PodiumCard = ({ rank, performer, platform }) => {
    const rankColor = rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-gray-300' : 'bg-yellow-600';
    const rankText = rank === 1 ? 'text-yellow-700' : rank === 2 ? 'text-gray-700' : 'text-yellow-800';
    const PlatformIcon = platform === 'LeetCode' ? FaCode : FaGithub;
    const metricName = platform === 'LeetCode' ? 'submissions' : 'contributions';

    if (!performer || !performer.handlerid) { // Check if performer and handlerid exist
        return (
            <div className={`flex flex-col items-center p-4 rounded-lg shadow-md ${rankColor} ${rankText} h-48 justify-center`}>
                <p className="text-lg font-semibold">Position #{rank}</p>
                <p className="text-sm">Not filled</p>
            </div>
        );
    }
    
    // Ensure handlerid is an object and has handlername
    const handlerName = performer.handlerid.handlername || 'Unknown';
    const score = platform === 'LeetCode' ? performer.submissions : performer.contributions;


    return (
        <div className={`flex flex-col items-center p-4 rounded-lg shadow-md ${rankColor} ${rankText} min-h-[12rem] justify-between`}>
            <div className="text-center">
                <FaTrophy className={`mx-auto mb-2 ${rank === 1 ? 'text-5xl' : 'text-4xl'}`} />
                <p className="text-lg font-bold">#{rank}</p>
                <p className="text-md font-semibold truncate w-36" title={handlerName}>{handlerName}</p>
                <p className="text-xs">({performer.handlerid.handlerid})</p>
            </div>
            <div className="mt-2 text-center bg-white bg-opacity-30 px-2 py-1 rounded">
                <p className="text-xl font-bold">{score}</p>
                <p className="text-xs">{metricName}</p>
            </div>
        </div>
    );
};


const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = useCallback(() => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    }, [targetDate]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        if (!targetDate) return;
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    if (!targetDate || !timeLeft.days === undefined) {
        return <p className="text-center text-gray-600">Calculating time to next update...</p>;
    }
    
    const timerComponents = [];
    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && timeLeft[interval] !==0 ) { // Handle cases where timeLeft is initially empty
            return;
        }
        timerComponents.push(
            <span key={interval} className="text-center mx-1 p-2 bg-gray-700 text-white rounded-md min-w-[3rem]">
                <strong className="block text-2xl">{String(timeLeft[interval]).padStart(2, '0')}</strong>
                <span className="text-xs">{interval}</span>
            </span>
        );
    });
    
    return timerComponents.length ? 
        <div className="flex justify-center my-4">{timerComponents}</div> : 
        <p className="text-center text-lg text-green-500 font-semibold">Updating stats now or very soon!</p>;
};


const WeeklyLeaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quote, setQuote] = useState('');

    useEffect(() => {
        setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
        
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await API.getWeeklyLeaderboard();
                setLeaderboardData(response.data);
            } catch (err) {
                console.error("Failed to load weekly leaderboard:", err);
                setError('Failed to load the weekly report. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="text-center p-10">
                <div role="status" className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-4 font-semibold text-gray-600">Loading Weekly Report...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="m-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        );
    }
    
    const lastUpdatedDate = leaderboardData?.last_updated_at ? 
                            new Date(leaderboardData.last_updated_at).toLocaleString() : 
                            'Not yet updated';

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 mb-3">
                    Weekly Prowess Report
                </h1>
                <p className="text-lg text-gray-600">When you dare to see this, you dare to improve!</p>
                <p className="text-sm text-gray-500 mt-1">Last Updated: {lastUpdatedDate}</p>
            </header>

            {leaderboardData?.next_update_at && (
                <div className="my-8 p-6 bg-gray-800 text-white rounded-xl shadow-2xl">
                    <h3 className="text-2xl font-semibold text-center mb-3 text-yellow-400">Stats Update Again In:</h3>
                    <CountdownTimer targetDate={leaderboardData.next_update_at} />
                </div>
            )}

            {/* LeetCode Podium */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                    <FaCode className="mr-3 text-yellow-500" /> LeetCode Grinders 👩🏻‍💻
                </h2>
                {leaderboardData?.leetcode_top && leaderboardData.leetcode_top.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <PodiumCard rank={2} performer={leaderboardData.leetcode_top[1]} platform="LeetCode" />
                        <PodiumCard rank={1} performer={leaderboardData.leetcode_top[0]} platform="LeetCode" />
                        <PodiumCard rank={3} performer={leaderboardData.leetcode_top[2]} platform="LeetCode" />
                    </div>
                ) : (
                    <p className="text-center text-gray-500 bg-white p-6 rounded-lg shadow">No LeetCode top performers this week, or no LeetCode handlers added.</p>
                )}
            </section>

            {/* GitHub Podium */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                    <FaGithub className="mr-3 text-gray-700" /> GitHub Bugsters 🐛 
                </h2>
                 {leaderboardData?.github_top && leaderboardData.github_top.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <PodiumCard rank={2} performer={leaderboardData.github_top[1]} platform="GitHub" />
                        <PodiumCard rank={1} performer={leaderboardData.github_top[0]} platform="GitHub" />
                        <PodiumCard rank={3} performer={leaderboardData.github_top[2]} platform="GitHub" />
                    </div>
                ) : (
                     <p className="text-center text-gray-500 bg-white p-6 rounded-lg shadow">No GitHub top performers this week, or no GitHub handlers added.</p>
                )}
            </section>
            
            <footer className="text-center mt-12 py-6 border-t border-gray-200">
                <p className="text-md italic text-gray-600">"{quote}"</p>
            </footer>
        </div>
    );
};

export default WeeklyLeaderboard;