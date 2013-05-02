//
//  GSAPopupViewController.h
//  gsaexample
//
//  Created by BaoLei on 1/16/13.
//  Copyright (c) 2013 Hulu. All rights reserved. See LICENSE.txt.
//

#import <UIKit/UIKit.h>

@interface GSAPopupViewController : UIViewController <UITableViewDataSource, UITableViewDelegate> {
    NSArray* words_;
    NSArray* charArrays_;
}

@property (nonatomic) NSString* txt;

@end
