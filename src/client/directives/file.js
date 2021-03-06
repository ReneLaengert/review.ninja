// *****************************************************
// File Directive
// *****************************************************

module.directive('file', ['$state', function($state) {
        return {
            restrict: 'E',
            templateUrl: '/directives/templates/file.html',
            scope: {
                path: '=',
                content: '=',
                headSha: '=',
                selection: '=',
                reference: '='
            },
            link: function(scope, elem, attrs) {

                //
                // actions
                //

                scope.headRef = function(line) {
                    return (scope.headSha + '/' + scope.path + '#L' + line.head);
                };

                scope.select = function(line) {
                    if(line.head) {

                        var ref = scope.headRef(line);
                        var cur = scope.selection[0] ? scope.selection[0].ref : null;

                        scope.selection.length = 0;

                        if(ref !== cur) {
                            scope.selection.push({
                                ref: ref,
                                line: scope.path + '#L' + line.base
                            });
                        }
                    }
                };

                scope.go = function(headRefs) {

                    var issues = [];

                    if(headRefs) {
                        for(var i = 0; i < headRefs.length; i++) {
                            issues.push(headRefs[i].issue);
                        }
                    }

                    if(issues.length === 1) {
                        return $state.go('repo.pull.issue.detail', { issue: issues[0] });
                    }

                    $state.go('repo.pull.issue.master', { issues: issues });
                };
            }
        };
    }
]);
