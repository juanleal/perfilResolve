<div ng-controller="PostController" ng-init="findOne()">
    <div class="well">
        <h1>{{post.title}}</h1>
        <p>{{post.body}}</p>
        <hr/>
        <a href="/posts/edit/{{post.id}}">Edit</a> <a href="#" ng-click="remove(post)">Delete</a>   
    </div>
</div>


