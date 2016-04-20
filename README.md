# Communico (_koh-moo-NEE-koh_)

### Contents
[Summary](#summary)  
[Agile Development](#agile)  
[API Documentation](#api-doc)  

--

![The Beatles reading the paper.](./public/js/app/assets/BeatlesReadingNewspaper_EnlargedCropped@1x.png)

## Summary <a id="summary"></a>
**Communico** is an app for current affairs junkies. It is an app for news lovers to share, annotate, and comment on articles published online. Users will be able to collect, share, and track news articles on the topics that most interest them. Communico will expose users to news that might have gone unread and spark dialog that might have gone unsaid. Communico is for _reading the paper_, socially.

## Agile Development <a id="agile"></a>
Check out the communico development process on <a href="https://trello.com/b/u7Mr4zoQ/wdi-project-4-communico-mean" target="_blank">Trello</a>!

![Entity Relationship Diagrams for the data model](./readme_assets/Communico_ERD.png)

## API Documentation <a id="api-doc"></a>
### RESTful Routes
Route | Method | Path | Authentication
--- | --- | --- | ---
CREATE  | POST    | /users                   | None
SHOW    | GET     | /users/:id               | Token
UPDATE  | PUT     | /users/:id               | Token
CREATE  | POST    | /token                   | None
CREATE  | POST    | /users/:id/token         | Token
DELETE  | DESTROY | /users/:id/token         | Token
INDEX   | GET     | /articles                | Token
CREATE  | POST    | /articles                | Token
INDEX   | GET     | /users/:id/articles      | Token
UPDATE  | PUT     | /users/:id/articles      | Token
