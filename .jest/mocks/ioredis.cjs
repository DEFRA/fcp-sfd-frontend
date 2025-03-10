const mockRedisInstance = { 
  on: function(event, callback) {
    if (event === 'connect' && typeof callback === 'function') {
      callback();
    }
    return this;
  }
};

// Make on a jest mock function for spying
mockRedisInstance.on = jest.fn(mockRedisInstance.on);

function MockRedis() {
  return mockRedisInstance;
}

function MockCluster() {
  return mockRedisInstance;
}

// CommonJS exports
MockRedis.Cluster = MockCluster;
MockRedis.Redis = MockRedis;
module.exports = MockRedis;
module.exports.Redis = MockRedis;
module.exports.Cluster = MockCluster;
