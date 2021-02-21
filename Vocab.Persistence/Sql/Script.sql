create table Category
(
	Id int identity not null,
	Title varchar(50) not null,
	IsActive bit not null,
	CreateDate datetime not null,
	UpdateDate datetime not null,
	constraint PK_Category primary key (Id)
)
go

alter table Category
add constraint UQ_Category_Title
unique (Title)
go

create table Word
(
	Id int identity not null,
	KeyWord varchar(50) not null,
	ValueWord varchar(200) not null,
	IsActive bit not null,
	CreateDate datetime not null,
	UpdateDate datetime not null,
	constraint PK_Word primary key (Id)
)
go

create table WordCategory
(
	Id int identity not null,
	WordId int not null,
	CategoryId int not null,
	constraint PK_WordCategory primary key (Id)
)
go

alter table WordCategory
add constraint FK_WordCategory_WordId
foreign key (WordId)
references Word(Id)
go

alter table WordCategory
add constraint FK_WordCategory_CategoryId
foreign key (CategoryId)
references Category(Id)
go