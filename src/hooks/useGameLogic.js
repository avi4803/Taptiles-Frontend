import { useState, useEffect, useCallback } from 'react';

const INITIAL_TIME = 300; // 5 minutes in seconds

export const useGameLogic = (currentUsername = "You") => {
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [gameState, setGameState] = useState('active'); // 'active', 'finished'
    
    // Grid State Management
    const [tiles, setTiles] = useState(() => Array.from({ length: 200 }, (_, i) => {
        // Mocking some initial state visually (same pattern as before)
        if (i === 0 || i === 5 || i === 20 || i === 21 || i === 22 || i === 51) return { id: i, status: 'user' };
        if (i === 2 || i === 24 || i === 25 || i === 26 || i === 44) return { id: i, status: 'opponent-red', label: 'JD' };
        if (i === 4 || i === 28 || i === 47 || i === 48 || i === 49) return { id: i, status: 'opponent-teal', label: 'AB' };
        if (i === 11) return { id: i, status: 'opponent-amber', label: 'MK' };
        
        // Random scattering
        const rand = Math.random();
        if (rand > 0.95) return { id: i, status: 'user' };
        if (rand > 0.92) return { id: i, status: 'opponent-teal', label: 'OP' };
        
        return { id: i, status: 'unclaimed' };
    }));

    // Mock Leaderboard State
    const [leaderboard, setLeaderboard] = useState([
        { rank: 1, username: "PlayerAlpha", pts: 240, extra: "Level 42 Master", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7YF1gMoCbK9RyZi6exvPrFaZYq0ofGgwCDcQbcnFWomHQqIQia7BI1IRuuyU9WYEAa4_8F1GyLfeU78mVX-j5jLtficFtRgqc7DPEmuiqPuXG9xNeZMAl9GZueOkD-GnDxuBb2UfS3-KKyedM3eJj47QmgUvIDfd_ZITi4l3A9dYhG3QN2OVE-OKqX65f_w4_lbhKqOgW7Nv_-aNGSMSZMlQ3n8D2M_V4XrvrHhm_ay0ycElomuhbITU8foflRAtsNKWZoxBerBTb" },
        { rank: 2, username: "PlayerBeta", pts: 210, extra: "Strategist", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBT4Akxsr495GMoR8OiQ6ziwz_tlcFZgB3XXrn_HPDD07WK8qdia8KcWrVaClIsRpVFzkbGKzo7dSl1kDCI_JhAn0oh3Ia0QYquOHCuJlyLrgHlL2iOkwtAUdNW1Cclceps_F-5QKuvoSf_QMuXIfTlHFA0rCZnkVWx_X26VMWhsc_bxFWbQ5cpzEbF3r4TZiXLY4alNr3mMZdkzkK3NP_8blQCFSZ0b_52NhL7cn7nX-c6bYXA30Cbk3eut5H_OtRm9T8ekoOAeBV3" },
        { rank: 3, username: "CharlieZ", pts: 198, extra: "Rusher", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH0Le9aopLy_FnK1tIINqjGu_CBN9N-5Ey074uhwCzV0vnLB1WIuhD5ZEOgivwoF4X2cQJquc18b-ATxlSAFgyR2V_qFGYMvsMlSkRqVCrBQMDQbsXywL3aFv9J_993LMbDxnhTfeNsAymIF85_BenTTr0K9W9mdTZf_Qc3PHfE6PPAVCTsPNcVhuwHLA5398lKr-3dtnTs4zOMGncE354Zjia-wF7yKomxhiuaVmxe9HxhPJJEnJN7UG4qsyV1ExatoL_hW80H-ot" },
        // ... gaps handled in UI usually
        { rank: 12, username: currentUsername, pts: 145, extra: "Rising Star", active: true, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-2YF7a6rYfbSkbKB5CgJknPLs3LAtBqc5KvjSA6hDGNXUUNSVsUawBvW3ToXXmrGoCKYYW13-Vo30jgso6BG-vBQFBXMlJ5IyJ9d8ZvV19S_sjnX0F51TzzQXb_vVCqjqZ_I2iuxcaIyDeHXyidO6Xp3eaXNvPz0V1gIqo3iGztcZYYcsPnBB8tJlONX0S-DW41K5zMTJTHM0nfrGA27MPnybekCXszhINYTicUdRSW2p475FzQjU6tgyMgAES6NH-wJJBL0frGVr" },
        { rank: 13, username: "DeltaForce", pts: 142, extra: "Novice", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMHBqt_LfuwCKXZhaPHVU9e_5ndJzr9cDfC_dtt3_65i4_V2uv9ZzFTLEWi_r5BaAiwPsAtEkAfdOZEzY0_f6eKKRS5w18Q0qY5__I9tKqTXztEDcLeNkdZAs9WPB665jDCMJgjtud5zptcjN1tXYH7KPzIy6Tw32Kl1i4E5PWtNsH_0Aj9sxEXBG-lrC8Ku3fKFrOawIJpfBDdkcyradcvAiqGPv22xdQmol6j-MQzqG7Tbi9QuSVOVd1-oOrVKpNRJDv7KJ1VoNN" },
    ]);

    // Timer Logic
    useEffect(() => {
        if (timeLeft <= 0) {
            setGameState('finished');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Handle Tile Click
    const handleTileClick = useCallback((id) => {
        if (gameState !== 'active') return;

        setTiles(prev => prev.map(tile => {
            if (tile.id === id) {
                // If unclaimed -> Claim ('user')
                if (tile.status === 'unclaimed') {
                    // Update leaderboard logic could go here
                    return { ...tile, status: 'user' };
                }
                // If user owns it -> Unclaim (optional mechanic, or ensure can't unclaim others)
                // For now, let's say clicking own tile does nothing or visual feedback
            }
            return tile;
        }));
        
        // Update mock stats and sort
        setLeaderboard(prev => {
            const updated = prev.map(p => 
                p.username === (currentUsername || "You") ? { ...p, pts: p.pts + 10 } : p
            );
            return updated.sort((a, b) => b.pts - a.pts).map((p, index) => ({ ...p, rank: index + 1 }));
        });

    }, [gameState]);

    // Format time helper
    const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

    return {
        tiles,
        handleTileClick,
        timeLeft,
        formattedTime,
        leaderboard,
        gameState
    };
};
