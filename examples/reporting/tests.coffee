gt.module 'test names with different lengths'

gt.test 'short test name', ->
gt.test 'medium length second test name', ->
gt.test 'long long long long long long long long message, continues even longer', ->

gt.test 'FAIL: failing assertions', ->
	gt.ok false, 'short fail'
	gt.ok false, 'medium message on fail'