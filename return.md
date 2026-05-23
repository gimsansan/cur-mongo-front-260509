PS C:\Users\SONGSEOP\Documents\DEV\cur_gem_mongo_front_260509> $res = Invoke-RestMethod -Method GET -Uri "http://localhost:4000/api/tasks"      
>> $res.message        # "GET /api/tasks success"
>> $res.data           # tasks 배열 전체
>> $res.data[0]        # 첫 번째 task
>> $res.data[0].title  # "Learn Express routing"
>> $res.data[1].id     # 2
>> $res.data.Count     # 배열 개수 (2)
                             
id title
-- -----
 1 Learn Express routing
 2 Test GET and POST endpoints
 1 Learn Express routing
Learn Express routing
2
2