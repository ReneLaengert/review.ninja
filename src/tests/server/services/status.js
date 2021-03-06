require('trace.ninja');

// unit test
var assert = require('assert');
var sinon = require('sinon');

// config
global.config = require('../../../config');

// services
var url = require('../../../server/services/url');
var github = require('../../../server/services/github');

// models
var Star = require('../../../server/documents/star').Star;

// service
var status = require('../../../server/services/status');

describe('status:update', function() {
    it('should treat null stars and issues as 0 and it should set the status to pending', function(done) {
        var starStub = sinon.stub(Star, 'find', function(args, done) {
            done(null, null);
        });
        var githubStub = sinon.stub(github, 'call', function(args, done) {
            if(args.obj === 'issues' && args.fun === 'repoIssues') {
                done(null, null);
            }
            if(args.obj === 'statuses' && args.fun === 'create') {
                assert.deepEqual(args, {
                    obj: 'statuses',
                    fun: 'create',
                    arg: {
                        user: 'user',
                        repo: 'repo',
                        sha: 'sha',
                        state: 'pending',
                        description: 'Review Ninja: 0 stars, 0 issues',
                        target_url: 'https://review.ninja/user/repo/pull/1'
                    },
                    token: 'token'
                });
                done(null, null);
            }
        });

        var args = {
            user: 'user',
            repo: 'repo',
            repo_uuid: 1234,
            sha: 'sha',
            number: 1,
            token: 'token'
        };

        status.update(args, function(err, status) {
            starStub.restore();
            githubStub.restore();
            done();
        });
    });

    it('should be a successful review if stars > 0 and no issues', function(done) {
        var starStub = sinon.stub(Star, 'find', function(args, done) {
            done(null, [{user: 'user', repo: 'repo'}]);
        });
        var githubStub = sinon.stub(github, 'call', function(args, done) {
            if(args.obj === 'issues' && args.fun === 'repoIssues') {
                done(null, null);
            }
            if(args.obj === 'statuses' && args.fun === 'create') {
                assert.deepEqual(args, {
                    obj: 'statuses',
                    fun: 'create',
                    arg: {
                        user: 'user',
                        repo: 'repo',
                        sha: 'sha',
                        state: 'success',
                        description: 'Review Ninja: 1 stars, 0 issues',
                        target_url: 'https://review.ninja/user/repo/pull/1'
                    },
                    token: 'token'
                });
                done(null, null);
            }
        });

        var args = {
            user: 'user',
            repo: 'repo',
            repo_uuid: 1234,
            sha: 'sha',
            number: 1,
            token: 'token'
        };

        status.update(args, function(err, status) {
            starStub.restore();
            githubStub.restore();
            done();
        });
    });

    it('should be a failed review if stars > 0 and issues exist', function(done) {
        var starStub = sinon.stub(Star, 'find', function(args, done) {
            done(null, [{user: 'user', repo: 'repo'}]);
        });
        var githubStub = sinon.stub(github, 'call', function(args, done) {
            if(args.obj === 'issues' && args.fun === 'repoIssues') {
                done(null, [{number: 2}]);
            }
            if(args.obj === 'statuses' && args.fun === 'create') {
                assert.deepEqual(args, {
                    obj: 'statuses',
                    fun: 'create',
                    arg: {
                        user: 'user',
                        repo: 'repo',
                        sha: 'sha',
                        state: 'failure',
                        description: 'Review Ninja: 1 stars, 1 issues',
                        target_url: 'https://review.ninja/user/repo/pull/1'
                    },
                    token: 'token'
                });
                done(null, null);
            }
        });

        var args = {
            user: 'user',
            repo: 'repo',
            repo_uuid: 1234,
            sha: 'sha',
            number: 1,
            token: 'token'
        };

        status.update(args, function(err, status) {
            starStub.restore();
            githubStub.restore();
            done();
        });
    });
});
