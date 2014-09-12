var app = angular.module('angularTableApp', ['ui.router','ui.bootstrap'])
.filter('skip', function()
{
	return function(array, skipAt, perPage)
	{
		return array ? array.slice((skipAt-1)*perPage) : [];
	};
})
.directive('angularTable', ['$compile', function($compile)
{
	return {
		restrict: 'A',
		link: function(scope, element, attrs)
		{
			scope.loaded = 0;
			scope.itemsPerPage = 10;
			scope.currentPage = 1;
			scope.maxPageButtons = 5;
			scope.loaded = 1;
			scope.sortField = '';
			scope.emptyMessage = 'No Items Found';

			if(attrs.tableItemsPerPage) scope.itemsPerPage = attrs.tableItemsPerPage;
			if(attrs.tableSortField) scope.sortField = attrs.tableSortField;
			if(attrs.tableEmptyMessage) scope.emptyMessage = attrs.tableEmptyMessage;

			if(attrs.tablePagination)
			{
				element.parent().append($compile(
					'<div>' +
						'<div class="pull-left">' +
							'<pagination total-items="'+attrs.tableItems+'.length || 1" items-per-page="itemsPerPage" max-size="maxPageButtons" class="pagination-small" boundary-links="true" ng-model="currentPage"></pagination>' +
						'</div>' +
						'<select ng-model="itemsPerPage" class="form-control pull-left pagination" style="width:120px; margin-left: 20px;">' +
							'<option value="10">10 per page</option>' +
							'<option value="25">25 per page</option>' +
							'<option value="50">50 per page</option>' +
							'<option value="9999">Show All</option>' +
						'</select>' +
					'</div>'
					)(scope));
			}

			var thead = element.find('thead')[0];
			var ths = angular.element(thead).find('th');

			for(i = 0; i < ths.length; ++i)
			{
				var field = ths[i].getAttribute('table-sort');
				if(field)
				{
					ths[i].setAttribute('ng-click',"sortTable('"+field+"')");
					angular.element(ths[i]).append('&nbsp;<span ng-class="sortTableArrow(\''+field+'\')"></span>');
					$compile(ths[i])(scope);
				}
			}

			var tbody = element.find('tbody')[0];
			angular.element(tbody).append($compile(
				'<tr ng-show="loaded==0"><td colspan="99" style="text-align:center;padding-top:20px;padding-bottom:20px;"> <div class="row-fluid"> <div class="innerLR"> <!-- Column --> <div class="span12"> <div class="get-started"> <div class="w100 tcenter"> <h3>Loading, please wait ... </h3> <div class="separator bottom center"></div> </div> </div> </div> <!-- // Column END --> </div> </div> </td></tr>' +
				'<tr ng-show="loaded==1 && '+attrs.tableItems+'.length==0">' +
					'<td colspan="99" style="text-align:center;padding-top:20px;padding-bottom:20px;"> <div class="row-fluid"> <div class="innerLR"> <!-- Column --> <div class="span12"> <div class="get-started"> <div class="w100 tcenter"> <h3>'+scope.emptyMessage+'</h3> <div class="separator bottom center"></div> </div> </div> </div> <!-- // Column END --> </div> </div> </td>' +
				'</tr>'
				)(scope));

			scope.sortTable = function(sortField)
			{
				if(scope.sortField != sortField)
				{
					scope.sortField = sortField;
				}
				else
				{
					scope.sortField = '-'+sortField;
				}
			};

			scope.sortTableArrow = function(field)
			{
				if(scope.sortField==field)
				{
					return "glyphicon glyphicon-chevron-down";
				}
				else if(scope.sortField=='-'+field)
				{
					return "glyphicon glyphicon-chevron-up";
				}
				else
				{
					return '';
				}
			};

		}
	};
}])
.config(['$stateProvider', function($stateProvider)
{
	$stateProvider
	.state('directory',
	{
		url: '',
		templateUrl: 'directory.html',
		resolve:
		{
			employees: ['$timeout', '$q', function($timeout, $q)
			{
				var deferred = $q.defer();            	

				$timeout(function()
				{
					var data = [
						{id:1, firstName:'William', lastName:'Hartnell', series:'Old'},
						{id:2, firstName:'Patrick', lastName:'Troughton', series:'Old'},
						{id:3, firstName:'Jon', lastName:'Pertwee', series:'Old'},
						{id:4, firstName:'Tom', lastName:'Baker', series:'Old'},
						{id:5, firstName:'Peter', lastName:'Davison', series:'Old'},
						{id:6, firstName:'Colin', lastName:'Baker', series:'Old'},
						{id:7, firstName:'Sylvester', lastName:'McCoy', series:'Old'},
						{id:8, firstName:'Paul', lastName:'McGann', series:'Old'},
						{id:9, firstName:'Christopher', lastName:'Eccleston', series:'New'},
						{id:10, firstName:'David', lastName:'Tennant', series:'New'},
						{id:11, firstName:'Matt', lastName:'Smith', series:'New'},
						{id:12, firstName:'Peter', lastName:'Capaldi', series:'New'}
					];
					deferred.resolve(data);
				}, 100);

				return deferred.promise;
			}]
		},
		controller: ['$scope', 'employees', function($scope, employees)
		{
			$scope.employees = employees;

			$scope.search = {name:'',series:''};
			$scope.filterEmployees = function(employee)
			{
				if($scope.search.name === '' || (employee.firstName+' '+employee.lastName).toLowerCase().indexOf($scope.search.name.toLowerCase()) >= 0)
				{
					if($scope.search.series === '' || $scope.search.series === null || $scope.search.series==employee.series)
					{
						return employee;
					}
				}
			};

		}]
	});
}]);