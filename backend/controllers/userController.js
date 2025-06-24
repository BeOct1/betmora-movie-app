import User from '../models/User.js';

// Follow a user
export const followUser = async (req, res) => {
  const userId = req.user._id;
  const targetId = req.params.id;
  if (userId === targetId) return res.status(400).json({ message: 'You cannot follow yourself.' });
  try {
    const user = await User.findById(userId);
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: 'User not found.' });
    if (user.following.includes(targetId)) return res.status(400).json({ message: 'Already following.' });
    user.following.push(targetId);
    target.followers.push(userId);
    await user.save();
    await target.save();
    res.json({ message: 'Followed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  const userId = req.user._id;
  const targetId = req.params.id;
  try {
    const user = await User.findById(userId);
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: 'User not found.' });
    user.following = user.following.filter(id => id.toString() !== targetId);
    target.followers = target.followers.filter(id => id.toString() !== userId);
    await user.save();
    await target.save();
    res.json({ message: 'Unfollowed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get followers
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'name username');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get following
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'name username');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  followUser: (req, res) => followUser(req, res),
  unfollowUser: (req, res) => unfollowUser(req, res),
  getFollowers: (req, res) => getFollowers(req, res),
  getFollowing: (req, res) => getFollowing(req, res),
};
