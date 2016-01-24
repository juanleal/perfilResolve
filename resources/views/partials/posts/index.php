<div ng-controller="PostController" ng-init="find()">   
    <div class="well">
        <a href="/posts/create">New Post</a>
        <hr/>
        <div class="row" ng-repeat="post in posts">
            <div class="col-lg-6">
                <div class="input-group">
                    <a href="/posts/show/{{post.id}}"><h4>{{post.title}}</h4></a>
                    <p>{{post.body}}</p>             
                </div>
            </div>
        </div>
    </div>
</div>


