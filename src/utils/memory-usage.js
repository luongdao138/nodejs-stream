module.exports = function getMemory(memoryTypes = ["rss"]) {
  return Object.entries(process.memoryUsage()).reduce((carry, [key, value]) => {
    if (!memoryTypes.includes(key)) return carry;

    return `${carry}${key}:${
      Math.round((value / 1024 / 1024) * 100) / 100
    }MB; `;
  }, "");
};
