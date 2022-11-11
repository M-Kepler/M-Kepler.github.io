- [数据库](#数据库)
  - [sql 脚本](#sql-脚本)
    - [生成一千万条测试数据](#生成一千万条测试数据)
    - [获取命令行的输出](#获取命令行的输出)
    - [锁表 / 连接](#锁表--连接)
    - [一列中相同的值，怎么只显示一次](#一列中相同的值怎么只显示一次)
    - [同一条记录显示 n 次](#同一条记录显示-n-次)
    - [身份证字段导出 csv，15 位数字后的数字都显示为 0](#身份证字段导出-csv15-位数字后的数字都显示为-0)
    - [数据库表占用空间](#数据库表占用空间)
    - [stk_trdacct 表中,一个客户号对应着多条记录](#stk_trdacct-表中一个客户号对应着多条记录)
  - [存储过程](#存储过程)
  - [触发器](#触发器)
  - [分库分表](#分库分表)

# 数据库

## sql 脚本

### 生成一千万条测试数据

- 两千万测试数据 419

```sql
--创建一个临时表，用于提供序列号

CREATE GLOBAL TEMPORARY table t_sequence_num(sequenceNum number(8) not null)ON COMMIT PRESERVE ROWS;
begin

--生成1万个序号

delete from t_sequence_num;

-- 每 10000 条提交一次
for i in 0..9999 loop
    insert into t_sequence_num(sequenceNum) values(i);
end loop;

--使用APPEND提示，每次1万条，进行数据插入

for i in 1..10 loop
  insert /*append*/ into kbssuser.tmp_STK_TRDACCT (CUST_CODE, CUACCT_CODE, INT_ORG, STKEX, STKBD, TRDACCT, TRDACCT_SN, TRDACCT_EXID, TRDACCT_TYPE, TRDACCT_EXCLS, TRDACCT_NAME, TRDACCT_STATUS, TREG_STATUS, BREG_STATUS, STKPBU, FIRMID, ID_TYPE, ID_CODE, ID_ISS_AGCY, ID_EXP_DATE, OPEN_DATE, YMT_CODE, CLOSE_DATE)
         select 170005273 +i * 10000 + t_sequence_num.sequencenum as MSISDN, 555520174945+i * 10000 + t_sequence_num.sequencenum as MSISDN, '3013', '0', '00', 4399174689+i * 10000 + t_sequence_num.sequencenum as MSISDN, '0', 4399174689+i * 10000 + t_sequence_num.sequencenum as MSISDN, '0', '0', '报价回购测试数据'||TO_CHAR(i * 10000 + t_sequence_num.sequencenum , 999999999999), '0', ' ', ' ', '003400', ' ', '00', 741223195408261177+i * 10000 + t_sequence_num.sequencenum as MSISDN, ' ', '20350808', '20181112',180000019111+i * 10000 + t_sequence_num.sequencenum as MSISDN, '0'
         from t_sequence_num;
commit;
end loop;
end;
/

-- 注：生成的客户号是在 170005273 + 10000 的基础上递增 1~10000 直到 10~10000

-- 总生成数据量为 10 * 10000
```

### 获取命令行的输出

```sql
SQL>spool d:\log.log
SQL>select * from users;
SQL>spool off
```

### 锁表 / 连接

```sql
-- 查看那张表被锁了
select b.owner, b.object_name, a.session_id, a.locked_mode from v$locked_object a, dba_objects b where a.object_id = b.OBJECT_ID ;

-- 查看有多少个main程序的连接
select a.OSUSER, a.PROGRAM,a.SQL_EXEC_START, a.* from v$session a where a.program like '%main%' and username is not null;

```

### [一列中相同的值，怎么只显示一次](http://www.itpub.net/thread-1768915-1-1.html)

```sql
CREATE TABLE aaaaaa(
    ob_id VARCHAR(32),
    ob_name VARCHAR(32)
);

INSERT INTO aaaaaa VALUES('A001','A001-a');
INSERT INTO aaaaaa VALUES('A001','A001-b');
INSERT INTO aaaaaa VALUES('A001','A001-c');
INSERT INTO aaaaaa VALUES('A001','A001-d');
INSERT INTO aaaaaa VALUES('A002','A002-a');
INSERT INTO aaaaaa VALUES('A002','A002-b');
INSERT INTO aaaaaa VALUES('A002','A002-c');
INSERT INTO aaaaaa VALUES('A002','A002-d');
COMMIT;


select decode(row_number() over(partition by ob_id order by ob_name), 1, ob_id) ob_id, ob_name from aaaaaa t;

-- 查询结果：
A001  A001-a
      A001-b
      A001-c
      A001-d
A002  A002-a
      A002-b
      A002-c
      A002-d

```

### 同一条记录显示 n 次

```
select t1.user_code,t1.user_name,t1.open_date
       from (select user_code, user_name, open_date, 6 times from kbssuser.users) t1,
            (select rownum num from (select 6 max_num from dual) connect by rownum <= max_num) t2
       where t1.times >= t2.num
       and t1.user_code = 170003955
       order by t1.user_code;
```

### 身份证字段导出 csv，15 位数字后的数字都显示为 0

```sql
/*
 * 导出csv不显示科学技术的方法
 * 在超过11位数字的字段前面并上一个单引号，如：''''||id_code
 */
select user_code, ''''||id_code from users where user_code = 150248498;
```

### 数据库表占用空间

```sql
select username,default_tablespace from user_users;

--  表空间占用
SELECT SUM(BYTES) / 1024 / 1024  ||'MB' FROM USER_SEGMENTS U  WHERE TABLESPACE_NAME = 'TS_KBSS';

-- 查看一个表所占的空间大小：
SELECT bytes/1024/1024 ||'MB' TABLE_SIZE ,u.* FROM USER_SEGMENTS U WHERE U.SEGMENT_NAME=upper('user_ext_info_20170602');

-- 按占用空间排序
select  u.segment_name,bytes/1024/1024 ||'MB' TABLE_SIZE  from USER_SEGMENTS u order by bytes desc;

select count(*) from user_ext_info_20170602; -- 3146465
```

- `select 1 from tb_name`

  select 1 from 中的 1 是一常量，查到的所有行的值都是它，从效率上来说，`1 > columns_name > *`，因为不用查字典表。

### stk_trdacct 表中,一个客户号对应着多条记录

```sql
cust_code cuacct_code   stkbd trdacct     treg_status
170112885 301330030690  00    0199242324
170112885 301330030690  10    A010242325  1
170112885 301330030690  10    A010243478

-- 筛选出仅开了某些股东的客户;
select * from kbssuser.stk_trdacct a where a.cust_code in (
       select a.cust_code from kbssuser.stk_trdacct a
              group by(a.cust_code) having count(a.stkbd) = 1 ) -- 仅开了1个股东的客户
       and a.stkbd in ('00') --仅开了深A的股东
       ;

  * 怎么筛选出未开 xxx 股东的用户？
select a.cust_code from kbssuser.stk_trdacct a  where 1=1
       and not exists(select 1 from kbssuser.stk_trdacct b
           where b.stkbd='10' -- 不存在 沪A
           and a.cust_code=b.cust_code)
```

- `trunc`

- `CASE WHEN`

  CASE WHEN ... THEN ... WHEN... THEN ... ELSE ... END;

  ```sql
  update tmp_users_171207 a set birthday = case when length(a.id_code)=18 then substr(a.id_code,7,8) when length(a.id_code)=15 then '19'||substr(a.id_code,7,6) end;
  commit; -- 获取出生日期
  ```

- `UNION SELECT`

  UNION 操作符用于合并两个或多个 SELECT 语句的结果集, 这些结果的字段要求一样。

  ```sql
  select * from kbssuser.users a where a.user_code=170112750
  union
  select * from kbssuser.users b where b.user_code=170113323;
  ```

- `JOIN`

  结果是将两张表左右排列在一起，然后显示

  http://blog.csdn.net/shadowyelling/article/details/7684714

  连接查询和直接等于来关联查询要好，只会拉取符合的数据处理；等于是把全部拉出来

  ```sql
  1. 外连接：
  -- left  join(左联接) 返回包括左表 users 中的所有的记录,右表显示满足联接条件的记录, 没有则显示null
  select * from kbssuser.users a left join kbssuser.customer b on a.user_code=b.cust_code and b.cust_code=181920761;

  -- right join(右联接) 返回包括右表 customer 中的所有记录, 左表显示满足联接条件的记录, 没有则显示null
  select * from kbssuser.users a right join kbssuser.customer b on a.user_code=b.cust_code and a.user_code=180000016;

  -- full join(全连接) 全连接，显示两个表所有的信息。

  -- (+)


  2. 内连接：
  -- inner join(等值连接) 只返回两个表中满足联结条件的记录
  select * from kbssuser.users a inner join kbssuser.customer b on a.user_code=b.cust_code

  3. (+)

  ```

- `ROW_NUMBER() OVER(PARITION / ORDER BY)`

  ```sql
  -- 1. row_number() over(order by column desc)先对column降序, 再为每条记录返回一个序列号：
  select row_number() over(order by a.open_date desc) row_num,a.* from kbssuser.users a;

  -- 2. 查询客户最新的风险测评信息
    -- 把查询到的记录按照客户号进行分组，并对组内的数据降序排序，然后选取ROW_NUM为1即最新的数据
  select c.ROW_NUM,c.* from (
        select t.*, row_number() over(partition by t.user_code order by t.rating_date desc) ROW_NUM from
                kbssuser.survey_rating t where 1=1
                and t.survey_sn=36 -- 根据需要筛选需要的数据
                and t.user_code in ('150160322','170000893','170100015')) c -- 为了效果清晰明显，只用了三个客户号
        where c.ROW_NUM = 1;

  -- oracle 先分组后获取每组最大值
  -- 3、风险测评不完整
  select c.ROW_NUM, c.user_code, c.survey_sn, c.ordinal, c.num
        from (select a.user_code, a.survey_sn, a.ordinal, count(a.survey_col) as num,
                      row_number() over(partition by a.user_code order by a.ordinal desc) ROW_NUM
                      from kbssuser.survey_ans a
                      where 1 = 1
                      and a.survey_sn = 36 -- 测试题号
                      group by a.ordinal, a.user_code, a.survey_sn
              ) c
              where c.ROW_NUM <= 1
              and c.num < 11; -- 参考值

  ```

- `GROUP BY、HAVING、聚合函数`

  对分组后的数据使用聚合函数筛选

  ```sql
  -- 查询仅开了深A的账户
  select * from kbssuser.stk_trdacct a where a.cust_code in (
       select a.cust_code from kbssuser.stk_trdacct a
              group by(a.cust_code) having count(a.stkbd) = 1 ) -- 仅开了1个股东的客户
       and a.stkbd in ('00') --仅开了深A的股东
       ;

  -- 有多条survey_sn=36 的客户； where 和group by一起用
  select a.user_code, count(a.user_code) from kbssuser.survey_rating a
         where a.survey_sn='36' group by a.user_code having count(a.user_code) >1;
  ```

- `EXISTS`

  WHERE EXISTS (子查询) -- 该子查询实际上并不返回任何数据，而是表示是否有数据，有则返回 True 否则返回 False

- 删除重复的行

- `CONCAT & ||` 字符串拼接

- `INSERT INTO SELECT` 从一个表复制数据到另一个表；也可以指定复制哪些字段的数据

  ```sql
  insert into kbssuser.users select * from kbssuser.tmp_users_20180122;
  ```

- [`floor、ceil、round、trunc`](http://blog.csdn.net/iteye1011/article/details/12449393)

- [`SUBSTR`](https://www.cnblogs.com/miaoying/p/5784947.html)

  ```sql
  --substr(字符串，截取开始位置，截取长度)=返回截取的字
  select substr('miaoying',0,1) from dual;--返回结果为：m
  select substr('miaoying',1,1) from dual;--返回结果为：m--说明0和1都表示截取的位置为第一个字符
  select substr('miaoying',-7,4) from dual;--返回结果为：iaoy--负数表示：-7表示从右边开始数第七位开始，也就是i，截取长度为4的字符串

  --instr(源字符串，目标字符串，起始字符串，匹配字符串)=返回要截取的字符串在源字符串中的位置，从字符的开始，只检索一次
  --instr(string1,string2,index1,index2) 表示：要在string1的index1号位置，开始查找，第index2次，出现的string2
  select instr('miaoying','i',2,2) from dual;--返回6:也就是说：在"miaoying"的第2号位置开始，查找第二次出现的i的位置
  select instr('miaoying','k',2,2)from dual;--返回0:即如果查找不到，则返回0
  select instr('miaoying','i') from dual;--返回2
  select instr('miaoying','yi') from dual;--返回5：即"yi"的y的位置
  select instr('miaoying','i',-1,2) from dual;--返回2：
  --空格也是字符。。。。。

  select * from omgnode a where name like '%miaoying%'
  select * from omgnode a where instr(name,'miaoying')>0--效果一样
  ```

- `TO_NUMBER`

- `INSTR`

  instr() 返回值是目标字符（串）在母字符里第一次出现的位置，故而是整数。

  ```sql
  instr("efabcdefg","e") // 结果为1;  instr(2, "efabcdefg", "e")  // 结果为7

  -- 代替like
  select * from kbssuser.user a where instr(a.user_code, '120') >0;
  -- select * from kbssuser.user a where a.user_code like '%120%';

  -- 代替 in
  select * from kbssuser.user a where a.user_code in('150160322','170000205');
  -- select * from kbssuser.user a where instr ('150160322','170000205', a.user_code) >0;
  ```

- `NVL`
  如果第一个参数为空那么显示第二个参数的值，如果第一个参数的值不为空，则显示第一个参数本来的值。
  select nvl(列，0) from table_name;
  如果表中成绩列有为**`NULL`**时，将会被替换成 0; 而当列为**空格**时，不会被替换

- [NULL、空字符串、空格区别](https://www.cnblogs.com/memory4young/p/use-null-empty-space-in-oracle.html)

- 账户系统 svn 上`PingAn_kbss_ums\sql`文件夹下的脚本的命名规则

  - 有修复的脚本命名为:

    `版本号_001_kbssuser_(操作)_tab_(表名)_(CAMS编号).sql`

  - 版本的脚本有两个，一个是 update，一个是 alter

    `版本号(R)_ora_update.sql`和`版本号(R)_ora_alter_table.sql`
    这两个脚本把前面`版本号_001`这些都包含在里面了。

## 存储过程

- Job

```sql
-- 存储过程
create or replace procedure STK_ACCTBIZ_LOG_wd_job
 is
iReserveDays integer;
iStatus  integer;
begin
    iReserveDays := 45;
    iStatus := -1;
    STK_ACCTBIZ_LOG_weekly_delete( iReserveDays, iStatus );

end STK_ACCTBIZ_LOG_wd_job;


-- job
var jobno number;
begin
   select job into :jobno  from user_jobs  where what = 'STK_ACCTBIZ_LOG_wd_job;';
   sys.dbms_job.remove( :jobno );
   commit;
end;

var  job number;
begin
  sys.dbms_job.submit(job => :job,
                      what => 'STK_ACCTBIZ_LOG_wd_job;',
                      next_date => trunc( sysdate, 'iw') + 6 + 5/48,
                      interval => 'TRUNC(next_day(sysdate,''星期日''))+ 5/48');

  commit;
end;
```

- declare 用在存储过程，匿名的 begin end 代码段也可以使用

```sql
declare
  v_Sql varchar2(2000);
  v_count number;
begin
  for xx in (select t.user_code, t.user_name, t.id_type, t.id_code from users t where t.user_name like '%yiren%') loop
    begin
      v_Sql := 'select count(1) from ' ||'kbssuser.users'||
               ' where ' || xx.user_code || ' like ''%170111460%'' ';
      execute immediate v_Sql into v_count;
      if (v_count >= 1) then
        dbms_output.put_line('id_type:'|| xx.id_type);
        dbms_output.put_line('id_code:'|| xx.id_code);
      end if;
    exception when others then
        null;
    end;
  end loop;
end;
```

- 归档表

- 例子：中登日志归档

```sql
create or replace procedure weekly_delete is
sLastDay varchar2(20);
iStatus integer;
sErrMsg varchar2(2000);

iMinTrdDate integer;
iMinTrdYear integer;
iMinMonth integer;
iStartDay integer;
iEndDay integer;

sTableName varchar2(200);
v_sql varchar2(2000);
iProcNum integer;

begin
     /* 把45 天前的日志插入到 STK_ACCTBIZ_LOG_TMP 表 */
    select  to_char( sysdate -  45, 'YYYYmmdd' )  into  sLastDay from dual;
    sLastDay := sLastDay * 100000000;
    dbms_output.put_line('sLastDay:'||sLastDay);
    insert into  STK_ACCTBIZ_LOG_TMP  select * from STK_ACCTBIZ_LOG where SERIAL_NO <=  sLastDay;
    commit;

    /* 检查 STK_ACCTBIZ_LOG_TMP 表是否有数据 */
    iProcNum := 0;
    select count(1) into iProcNum from STK_ACCTBIZ_LOG_TMP;
    if iProcNum = 0 then
        commit;
        return;
    end if;
    dbms_output.put_line('iProcNum:'||iProcNum);

    /* 获取日志记录中的最早的日期 */
    select floor(min(SERIAL_NO)/100000000) into iMinTrdDate from STK_ACCTBIZ_LOG_TMP;
    iMinTrdYear := iMinTrdDate / 10000;
    iMinMonth := MOD(iMinTrdDate, 10000);
    dbms_output.put_line('iMinTrdDate:'||iMinTrdDate);
    dbms_output.put_line('iMinTrdYear:'||iMinTrdYear);
    dbms_output.put_line('iMinMonth:'||iMinMonth);

    /* 小于7月的日志插入到H1，大于7月的插到H2 中 */
    if iMinMonth < 701 then
       iStartDay := (iMinTrdYear * 10000 + 101) * 100000000; -- 2017010100000000
       iEndDay := (iMinTrdYear * 10000 + 701) * 100000000;   -- 2017070100000000
       sTableName := 'STK_ACCTBIZ_LOG_'|| iMinTrdYear||'_H1' ;
       v_sql := 'insert into KBSSUSER.'||  sTableName ||' select *  from  STK_ACCTBIZ_LOG_TMP where SERIAL_NO >='||iStartDay||' and SERIAL_NO <'||iEndDay;
       dbms_output.put_line('v_sql:'||v_sql);

       execute immediate v_sql;
       commit;

       iStartDay := (iMinTrdYear * 10000 + 701) * 100000000;     -- 2017070100000000
       iEndDay := ((iMinTrdYear + 1) * 10000 + 101) * 100000000; -- 2018010100000000
       sTableName := 'STK_ACCTBIZ_LOG_'|| iMinTrdYear||'_H2' ;
       v_sql := 'insert into KBSSUSER.'||  sTableName ||' select *  from  STK_ACCTBIZ_LOG_TMP where SERIAL_NO >='||iStartDay||' and  SERIAL_NO <'||iEndDay;
       dbms_output.put_line('v_sql:'||v_sql);

       execute immediate v_sql;
       commit;
    end if;

    /* 对于日志中最小的记录大于7月的情况 */
    if iMinMonth >= 701 then
       sTableName := 'STK_ACCTBIZ_LOG_'|| iMinTrdYear||'_H2' ;
       iStartDay := (iMinTrdYear * 10000 + 701) * 100000000; -- 2017070100000000
       iEndDay := ((iMinTrdYear + 1) * 10000 + 101) * 100000000; -- 2018010100000000
       v_sql := 'insert into KBSSUSER.'||  sTableName ||' select *  from  STK_ACCTBIZ_LOG_TMP where SERIAL_NO >='||iStartDay||' and SERIAL_NO <'||iEndDay;
       dbms_output.put_line('v_sql:'||v_sql);

       execute immediate v_sql;
       commit;


       sTableName := 'STK_ACCTBIZ_LOG_'||(iMinTrdYear +1)||'_H1' ;
       iStartDay := ((iMinTrdYear + 1 )* 10000 + 101) * 100000000; -- 2018010100000000
       iEndDay := ((iMinTrdYear + 1) * 10000 + 701) * 100000000; -- 2018070100000000
       v_sql := 'insert into KBSSUSER.'||  sTableName ||' select *  from  STK_ACCTBIZ_LOG_TMP where SERIAL_NO >='||iStartDay||' and SERIAL_NO <'||iEndDay;
       dbms_output.put_line('v_sql:'||v_sql);

       execute immediate v_sql;
       commit;

    end if;

    delete from  STK_ACCTBIZ_LOG  where SERIAL_NO <= sLastDay;
    dbms_stats.gather_table_stats( ownname => 'KBSSUSER', tabname => 'STK_ACCTBIZ_LOG', partname => null,
    estimate_percent => dbms_stats.auto_sample_size, block_sample => false, method_opt => 'FOR ALL  COLUMNS SIZE 1',
    degree => 16,granularity => 'all',cascade => true ,stattab => null,statid => null,statown => null ,no_invalidate => FALSE );
    commit;

    iStatus := 0;

    dbms_output.put_line('finish');
    Exception When Others Then
    sErrMsg := Sqlerrm;
    iStatus := SqlCode;
    commit;
end weekly_delete;
/

```

## 触发器

## 分库分表

- oracle 的分区表
